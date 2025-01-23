import { collection, doc, getDoc, getFirestore } from "firebase/firestore";
import { ChatModel } from "../models/ChatModel";
import { app } from "@/constants/firebase";


const firestore = getFirestore(app);
const chatsCollection = collection(firestore, "chats");

export async function getChatById(chatId:string):Promise<ChatModel|null>{
    try {
        const document = await getDoc(doc(firestore, "chats", chatId));
        return {id:document.id, ...document.data()} as ChatModel;
    } catch (error) {
        console.log("Error located at getChatById", error);
        return null;
    }
}
