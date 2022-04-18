import { KeyboardAvoidingView, StyleSheet, View, Platform } from 'react-native'
import { Input, Image, Button } from 'react-native-elements';
import { Zocial, Entypo } from '@expo/vector-icons';
import React, { useState, useEffect } from 'react';
import { auth, db } from './firebase'
import { signInWithEmailAndPassword } from 'firebase/auth'


const LoginScreen = ({ setLogin, setIsLoggedIn }) => {
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const login = () => {
        if (!(email && pass)) {
            alert("Fields cannot be empty");
            return false;
        }

        signInWithEmailAndPassword(auth, email, pass)
            .catch(err => alert(err.message));

        setIsLoggedIn(true);
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <Image
                // source={Logo}
                style={{ width: 150, height: 150 }}
            />
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
            <Button
                containerStyle={styles.buttoncontainer}
                title="Login"
                raised
                onPress={login}
            />
            <Button
                type="outlined"
                containerStyle={styles.buttoncontainer}
                title="Register"
                raised
                onPress={() => setLogin(false)}
            />

            <View style={{ height: 100 }}></View>
        </KeyboardAvoidingView>
    )
}

export default LoginScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
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