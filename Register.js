import { Input, Image, Button } from 'react-native-elements';
import { StyleSheet, KeyboardAvoidingView, ScrollView, View, Platform } from 'react-native'
import { Ionicons, FontAwesome5, Zocial, Entypo } from '@expo/vector-icons';
import React, { useState } from 'react';
import { auth, db } from './firebase';
import { doc, setDoc } from 'firebase/firestore'
import { createUserWithEmailAndPassword } from 'firebase/auth';

const RegisterScreen = ({ setLogin, setUser, setIsLoggedIn }) => {
    const [name, setName] = useState('');
    const [photo, setPhoto] = useState('');
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [repass, setRepass] = useState('');

    const register = async () => {
        if (!(name && email && pass && repass)) {
            alert("Fill all the required fields!");
            return false;
        }

        if (pass !== repass) {
            alert("Passwords do not match!");
            return false;
        }
        createUserWithEmailAndPassword(auth, email, pass)
            .then(authUser => {
                const docref = doc(db, "users", authUser.user.uid)
                const data = {
                    maxScore: 0,
                    username: authUser.user.email.split('@')[0],
                    name: name
                }
                setDoc(docref, data, {
                    merge: true,
                }).then(() => {
                    setUser(data)
                    setIsLoggedIn(true);
                }).catch(e => alert("Error!"))
            })
            .catch(err => alert(err.message));

        setName('');
        setPhoto('');
        setEmail('');
        setPass('');
        setRepass('');
        setLogin(true);
        setIsLoggedIn(true);
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Input
                    inputStyle={styles.input}
                    containerStyle={styles.inputcontainer}
                    placeholder="Full Name"
                    leftIcon={<FontAwesome5 name="user-tie" size={24} color="black" />}
                    value={name}
                    onChangeText={value => setName(value)}
                />
                {/* <Input
                    inputStyle={styles.input}
                    containerStyle={styles.inputcontainer}
                    placeholder="PhotoUrl (Optional)"
                    leftIcon={<Ionicons name="ios-image" size={24} color="black" />}
                    value={photo}
                    onChangeText={value => setPhoto(value)}
                /> */}
                <Input
                    inputStyle={styles.input}
                    containerStyle={styles.inputcontainer}
                    placeholder="Email"
                    leftIcon={<Zocial name="email" size={24} color="black" />}
                    value={email}
                    onChangeText={value => setEmail(value)}
                />
                <Input
                    inputStyle={styles.input}
                    containerStyle={styles.inputcontainer}
                    placeholder="Password"
                    secureTextEntry
                    leftIcon={<Entypo name="lock" size={24} color="black" />}
                    value={pass}
                    onChangeText={value => setPass(value)}
                />
                <Input
                    inputStyle={styles.input}
                    containerStyle={styles.inputcontainer}
                    placeholder="Re-enter Password"
                    secureTextEntry
                    leftIcon={<Entypo name="lock" size={24} color="black" />}
                    value={repass}
                    onChangeText={value => setRepass(value)}
                />

                <Button
                    containerStyle={styles.buttoncontainer}
                    title="Register"
                    raised
                    onPress={register}
                />
            </ScrollView>
            <View style={{ height: 100 }}></View>

        </KeyboardAvoidingView>
    )
}

export default RegisterScreen

const styles = StyleSheet.create({
    container: {
        paddingTop: 10,
        paddingBottom: 10,
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "white"
    },

    inputcontainer: {
        width: 300,
    },

    input: {
        marginLeft: 7,
        color: "black",
    },

    buttoncontainer: {
        width: 250,
        margin: 5,
    },
});