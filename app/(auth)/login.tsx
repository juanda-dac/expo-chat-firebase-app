import { useAppAuth } from '@/context/AuthContext';
import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { router } from "expo-router";
import Consts from '@/constants/Colors';

import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen() {

    const { login, error, setError } = useAppAuth();
    
    const initialState = {
        email: '',
        password: ''
    }
    const [form, setForm] = useState(initialState)

    useEffect(() => {
        if(error){
            Alert.alert("Error", error);
            console.log(error);
            setForm(initialState);
            // @ts-ignore
            setError("");
        }
    }, [error]);

    useEffect(() => {
        AsyncStorage.getAllKeys().then((keys) => {
            console.log(keys);
        }).catch((error) => console.log(error));
        
    }, []);

    const handleChange = (name: string, value: string) => {
        setForm({
            ...form,
            [name]: value
        })
    }

    const handleLogin = () => {
        if(!form.email || !form.password){
            Alert.alert("Error", "Please fill all fields");
            return;
        }

        login(form.email, form.password)
    };


    return (
        <View style={styles.container}>
            <View style={styles.containerForm}>
                <Text style={styles.title}>Login</Text>
                <View>
                    <TextInput placeholder='email' value={form.email} autoCapitalize='none' autoCorrect={false} keyboardType='email-address' inputMode='email' onChangeText={(text)=> handleChange("email", text)} style={styles.input} />
                </View>
                <View>
                    <TextInput placeholder='password' value={form.password} autoCapitalize='none' onChangeText={(text) => handleChange("password", text)} secureTextEntry style={styles.input} />
                </View>
                <View>
                    <TouchableOpacity onPress={handleLogin} style={styles.button} activeOpacity={0.8}>
                        <Text style={styles.buttonText}>Login</Text>
                    </TouchableOpacity>
                </View>
                <View>
                    <Text style={{ textAlign: 'center', marginTop: 10 }}>
                        Don't have an account? <Text style={{color:Consts.light.tint, fontWeight:'bold'}} onPress={()=>router.replace("/(auth)/register")}>Register</Text>
                    </Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    containerForm:{
        width: '80%',
        padding: 20,
        borderRadius: 10,
        boxShadow: '0 0 10px rgba(0,0,0,0.1)',
        elevation:5
    },
    title:{
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        color: Consts.light.tint
    },
    input:{
        padding: 10,
        height: 40,
        borderRadius: 5,
        borderColor:Consts.light.tint,
        backgroundColor:Consts.light.background,
        fontWeight: 'bold',
        color: Consts.light.tint,
        borderWidth: 1,
        marginVertical: 10,
        
    },
    button:{
        backgroundColor: Consts.light.tint,
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonText:{
        color:"#fff",
        fontWeight: 'bold'
    }
})
