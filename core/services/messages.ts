import { app } from "@/constants/firebase";
import {
    getFirestore,
    collection,
    getDocs,
    query,
    where,
    or,
    orderBy,
    limit,
    addDoc,
    deleteDoc,
    doc,
} from "firebase/firestore";
import { ChatModel } from "../models/ChatModel";
import { MessageModel } from "../models/MessageModel";

const firestore = getFirestore(app);
const chatsCollection = collection(firestore, "chats");
const messagesCollection = collection(firestore, "messages");
const tmpMessagesCollection = collection(firestore, "tmpMessages");

export async function getUserChats(uid: string): Promise<Array<ChatModel>> {
    try {
        const q = query(
            chatsCollection,
            or(where("userOne", "==", uid), where("userTwo", "==", uid))
        );
        
        const chats = await getDocs(q);
        return chats.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as Array<ChatModel>;

    } catch (error) {
        console.log("Error located at getUserChats", error);
        return [];
    }
}

export async function getLastMessageByChatId(chatId: string): Promise<MessageModel | null> {
    try {
        const chatDoc = collection(firestore, "messages");
        const q = query(chatDoc, where("chatId", "==", chatId), limit(1), orderBy("date", "desc"));
        const messages = await getDocs(q);
        const message =
            messages.docs.map((doc) => ({ id: doc.id, ...doc.data() }))[0] ||
            null;
        return message as MessageModel;
    } catch (error) {
        console.log("Error located at getLastMessageByChatId", error);
        return null;
    }
}

export async function getMessagesByChatId(chatId: string): Promise<Array<MessageModel>> {
    try {
        const q = query(messagesCollection, where("chatId", "==", chatId), orderBy("date"));
        const messages = await getDocs(q);
        return messages.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Array<MessageModel>;
    } catch (error) {
        console.log("Error located at getMessagesByChatId", error);
        return [];
    }
}

export async function sendMessage(message: MessageModel): Promise<void> {
    try {
        const added = await addDoc(messagesCollection, message);
        console.log("Document written with ID: ", added.id);
    } catch (error) {
        console.log("Error located at sendMessage", error);
    }
}

export async function sendMessageToTemporalCollection(message: MessageModel): Promise<void> {
    try {
        const added = await addDoc(tmpMessagesCollection, message);
        console.log("Document written with ID in temporal collection: ", added.id);        
    } catch (error) {
        console.log("Error located at sendMessage", error);
    }
}

export async function deleteMessageFromTemporalCollection(messageId: string): Promise<void> {
    try {
        await deleteDoc(doc(tmpMessagesCollection, messageId));
    } catch (error) {
        console.log("Error located at deleteMessageFromTemporalCollection", error);
    }
}

