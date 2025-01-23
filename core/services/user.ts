import { app } from "@/constants/firebase";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import { UserModel } from "../models/UserModel";
import AsyncStorage from "@react-native-async-storage/async-storage";

const userCollection = collection(getFirestore(app), "user");

export async function getUserById(uid: string):Promise<UserModel | null> {
    try {
        // Define the query
        const q = query(userCollection, where("uid", "==", uid));
        const user = await getDocs(q);
        return user.docs[0].data() as UserModel || null;
    } catch (error) {
        console.log("Error located at getUserById", error);
        return null;
    }
}

export async function fetchUserFromAsyncStorage():Promise<UserModel | null> {
    try {
        const user = await AsyncStorage.getItem("user");
        // @ts-ignore
        return JSON.parse(user);
    } catch (error) {
        console.log("Error located at fetchUser", error);
        return null;
    }
}