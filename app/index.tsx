import { useAppAuth } from "@/context/AuthContext";
import { Redirect, router } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, getFirestore, query, where, limit } from "firebase/firestore";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { app } from "@/constants/firebase";

export default function StartPage() {

    const { auth } = useAppAuth();
    const db = getFirestore(app);
    const coll = collection(db, "/user");

    useEffect(() => {
        onAuthStateChanged(auth, async (user) => {
            if(user){
                /** 
                 * user.uid => user id 
                 * user.email => user email
                 * user.displayName => user display name
                 * */
                console.log("User is logged in");
                const q = query(coll, where("uid", "==", user.uid), limit(1));
                const snapshots = await getDocs(q);
                const userDb = snapshots.docs[0].data();
                const userStorage = {
                    ...userDb,
                    email: user.email,
                }
                AsyncStorage.setItem("user", JSON.stringify(userStorage));
                
                router.replace("/(tabs)/chat");
            }
            else{
                console.log("User is not logged in");
                router.replace("/(auth)/login");
            }
        })
    }, []);

    // return <Redirect href="/(tabs)/chat" />;
    // return <Redirect href="/(auth)/login" />;
}
