import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import { router } from "expo-router";
import Consts from '@/constants/Colors';
import { useAppAuth } from '@/context/AuthContext';

export default function Register() {

    const initialState = {
        name:"",
        phone: 0,
        email: "",
        password: "",
        confirmPassword: ""
    }

    const [form, setForm] = useState(initialState);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const { register, error, setError, logout } = useAppAuth();

    useEffect(() => {
        if(error){
            Alert.alert("Error", error);
            setForm(initialState);
            // @ts-ignore
            setError("");
            return;
        }
    }, [error, isSubmitted]);

    const handleChange = (name: string, value: any) => {
        setForm({
            ...form,
            [name]: value
        })
    }

    const handleSubmit = () => {
        if(!form.email || !form.password || !form.confirmPassword || !form.name || !form.phone){
            Alert.alert("Error", "Please fill all fields");
            return;
        }

        if(form.password !== form.confirmPassword){
            Alert.alert("Error", "Passwords do not match");
            return;
        }

        register(form.email, form.password, form.name, form.phone);
        setForm(initialState);
        setIsSubmitted(true);
    }

    return (
        <View style={styles.container}>
            <View style={styles.containerForm}>
                <View>
                    <Text style={styles.title}>Create an account</Text>
                </View>
                <View>
                    <TextInput style={styles.input} value={form.name} onChangeText={(text)=> handleChange("name", text)} placeholder="Name" />
                </View>
                <View>
                    <TextInput keyboardType='phone-pad' style={styles.input} value={form.phone} onChangeText={(text)=> handleChange("phone", parseInt(text))} placeholder="Phone" />
                </View>
                <View>
                    <TextInput keyboardType='email-address' autoCapitalize='none' value={form.email} inputMode='email' onChangeText={(text)=> handleChange("email", text)} style={styles.input} placeholder="Email" />
                </View>
                <View>
                    <TextInput style={styles.input} autoCapitalize='none' value={form.password} secureTextEntry onChangeText={(text)=> handleChange("password", text)} placeholder="Password" />
                </View>
                <View>
                    <TextInput style={styles.input} autoCapitalize='none' value={form.confirmPassword} secureTextEntry onChangeText={(text) => handleChange("confirmPassword", text)} placeholder="Confirm Password" />
                </View>
                <View>
                    <TouchableOpacity onPress={handleSubmit} style={styles.button} activeOpacity={0.8}>
                        <Text style={styles.buttonText}>Register</Text>
                    </TouchableOpacity>
                </View>
                <View>
                    <Text style={{ textAlign:"center" }} >Already have an account? <Text onPress={()=> router.replace("/(auth)/login")} style={{ fontWeight:"bold", color:Consts.light.tint }}>Log in</Text></Text>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    },
    containerForm:{
        width:'80%',
        padding:20,
        borderRadius:10,
        boxShadow:'0 0 10px rgba(0,0,0,0.1)',
        elevation:5
    },
    title:{
        fontSize:24,
        fontWeight:'bold',
        textAlign:'center',
        color:Consts.light.tint
    },
    input:{
        padding:10,
        height:40,
        borderRadius:5,
        borderColor:Consts.light.tint,
        borderWidth:1,
        backgroundColor:Consts.light.background,
        fontWeight:'bold',
        color:Consts.light.tint,
        marginVertical:10
    },
    button:{
        padding:10,
        borderRadius:5,
        backgroundColor:Consts.light.tint,
        alignItems:'center',
        justifyContent:'center',
        marginVertical:10
    },
    buttonText:{
        color:"#fff",
        fontWeight:'bold'
    }
})

