import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { Text, TouchableOpacity, View, Button } from 'react-native';
import { GameEngine } from 'react-native-game-engine';
import entities from './entities';
import Physics from './physics';
import { GoogleAuthProvider, signInWithPopup, } from 'firebase/auth'
import { auth, db } from './firebase'
import { doc, setDoc, collection, getDoc } from 'firebase/firestore'
import '@expo/match-media'
import { useMediaQuery } from "react-responsive";



export default function App() {

  const [running, setRunning] = useState(false)
  const [gameEngine, setGameEngine] = useState(null)
  const [currentPoints, setCurrentPoints] = useState(0)
  const [highest, setHighest] = useState(0)
  const [user, setUser] = useState(null)
  const fetchGHighest = async () => {
    const docref = doc(db, "GlobalHighest", "public")
    try {
      const result = await getDoc(docref)
      // console.log(result.data())
      // const m=result.data()["globalmax"]
      const { globalmax } = result.data();
      setHighest(globalmax)
    }
    catch (err) {
      console.log(err)
    }

  }
  useEffect(() => {
    fetchGHighest();
    setRunning(false)


    auth.onAuthStateChanged(async (user) => {
      if (user) {
        const docref = doc(db, "users", user.uid)
        try {
          const result = await getDoc(docref)
          setUser(result.data())
        }
        catch (err) {
          console.log(err)
        }
      }
    })
  }, [])

useEffect(()=>{
  if (!running && auth.currentUser !== null && currentPoints > user.maxScore ) {
    updateMaxScore();
  }

},[running])








  const login = async () => {

    const provider = new GoogleAuthProvider()
    try {
      const result = await signInWithPopup(auth, provider)

      const docref = doc(db, "users", result.user.uid)
      const data = {
        maxScore: 0,
        username: result.user.email.split('@')[0]
      }
      const res = await setDoc(docref, data, {
        merge: true,
      })
      setUser(data)
    }
    catch (err) {
      console.log(err);
      alert("Error signing in")
    }
  }
  const signOut = () => {
    auth.signOut();
  }
  const updateGHighest = async () => {
    try {
      const docref = doc(db, "GlobalHighest", "public")
      const data = {
        globalmax: currentPoints,
      }
      const res = await setDoc(docref, data, {
        merge: true,
      })
      setHighest(currentPoints)
    }
    catch (e) {
      console.log(e)
    }
  }
  //onsole.log(user)

  const updateMaxScore = async () => {
  console.log("entered")

    try {
      const docref = doc(db, "users", auth.currentUser.uid)
      const data = {
        maxScore: currentPoints,
        
      }
      
      const res = await setDoc(docref, data, {
        merge: true,
      })
      setUser({ ...user, maxScore: currentPoints })
      currentPoints>highest && updateGHighest()
    }
    catch (e) {
      console.log(e)
      alert("Error updating high score")
    }
  }

  const isTabletOrMobileDevice = useMediaQuery({    
    maxDeviceWidth: 1000,
    // alternatively...
    query: "(max-device-width: 1000px)"  
  });
  if (!isTabletOrMobileDevice) {
    return (<View style={{flexGrow:1, alignItems: 'center',justifyContent: 'center',padding:20}}>
       <Text style={{ fontWeight: 900,fontSize:30}}>Hi Desktop Users 👋, Please switch to mobile or tablet to play this game!</Text></View>)
  }
  
  return (
        <View style={{ flex: 1, alignItems: 'center',objectFit:"cover",backgroundImage:"url(https://images.unsplash.com/photo-1517210122415-b0c70b2a09bf?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8Y2xvdWQlMjBhZXN0aGV0aWN8ZW58MHx8MHx8&w=1000&q=80)" }}>
      <Text style={{ textAlign: 'center', fontSize: 40, fontWeight: 'bold', margin: 20 , zIndex:150}}>{currentPoints}</Text>
      {!running && <Text onPress={login} style={{ zIndex: 200, fontWeight: 'bold', color: 'white', fontSize: 30, cursor: 'pointer', backgroundColor: 'black', paddingHorizontal: 30, paddingVertical: 10, textAlign: 'center' }}>
        {auth.currentUser !== null ? `Welcome, ${auth.currentUser.displayName}!` : "Login"}
      </Text>}
      {auth.currentUser !== null && !running && <Text onPress={signOut} style={{ position: 'absolute', top: 0, right: 0, zIndex: 200, fontWeight: 'bold', color: 'white', fontSize: 30, cursor: 'pointer', backgroundColor: 'black' }}>
        Sign Out
      </Text>}
      {auth.currentUser !== null && <Text onPress={signOut} style={{ position: 'absolute', bottom: 0, zIndex: 200, fontWeight: 'bold', color: 'white', fontSize: 30, cursor: 'pointer', backgroundColor: 'black' }}>
        Your Highest Score : {user?.maxScore}<br />
        //Global Highest Score: {highest}
      </Text>}
      { !running  && <Text onPress={signOut} style={{ position: 'absolute', bottom: 0, zIndex: 200, fontWeight: 'bold', color: 'white', fontSize: 30, cursor: 'pointer', backgroundColor: 'black' }}>
        {/*Your Highest Score : {user?.maxScore}<br /> */}
        Global Highest Score: {highest}
      </Text>}
      <GameEngine
        ref={(ref) => { setGameEngine(ref) }}
        systems={[Physics]}
        entities={entities()}
        running={running}
        onEvent={(e) => {
          switch (e.type) {
            case 'game_over':
              setRunning(false)
              gameEngine.stop()
              break;
            case 'new_point':
              setCurrentPoints(currentPoints + 1)

              break;
          }
        }}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      >
        <StatusBar style="auto" hidden={true} />

      </GameEngine>

      {!running ?
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <TouchableOpacity style={{ backgroundColor: 'black', paddingHorizontal: 30, paddingVertical: 10 }}
            onPress={() => {
              setCurrentPoints(0)
              setRunning(true)
              gameEngine.swap(entities())
            }}>
            <Text style={{ fontWeight: 'bold', color: 'white', fontSize: 30 }}>
              START GAME
            </Text>
          </TouchableOpacity>

        </View> : null}
    </View>
  );
}
