import Colors from "@/constants/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Href, router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, useColorScheme, View } from "react-native";
import { ChatItemProps } from "@/core/models/props/ChatItemProps";
import { useEffect, useState } from "react";
import { getChatRoomId } from "@/core/lib/chatRoom";
import { collection, doc, getFirestore, onSnapshot, orderBy, query } from "firebase/firestore";
import { app } from "@/constants/firebase";
import { MessageModel } from "@/core/models/MessageModel";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ChatItemList({ chat, userChat, currentUser }:ChatItemProps){

    const handleRedirect = () => router.push(`../(chat)/${chat.id}`);
    const theme = useColorScheme() || "light";
    const [lastMessage, setLastMessage] = useState<MessageModel | undefined | null>(undefined);

    useEffect(() => {
        const chatRoomId = getChatRoomId(currentUser.uid, userChat.uid);
        const docRef = doc(getFirestore(app), "chats", chatRoomId);
        const messagesRef = collection(docRef, "messages");
        const q = query(messagesRef, orderBy("date", "asc"));

        const findLastMessage = async () => {
            const allMessagesStorage = await AsyncStorage.getItem(`messages:${chatRoomId}`)
            // All messages sorted on desc
            const allMessages = JSON.parse(allMessagesStorage as string) as Array<MessageModel>;
            const indexLastMessage = allMessages.length - 1;
            if(allMessages.length > 0){
                setLastMessage(allMessages[indexLastMessage]);
                return;
            }

            const unSub = onSnapshot(q, (snapshot) => {
                const messages = snapshot.docs.map(doc => doc.data() as MessageModel);
                const indexLastMessage = messages.length - 1;
                setLastMessage(messages[indexLastMessage] ? messages[indexLastMessage] : null);
            });

            return unSub;
        }

        findLastMessage();
    }, []);

    const renderLastMessage = () => {
        if(lastMessage === undefined) return "Loading...";
        if(lastMessage){
            if(lastMessage.sender === currentUser.uid) return `You: ${lastMessage.text}`;
            return lastMessage.text;
        }else{
            return "No messages yet";
        }
    }

    return (
        <TouchableOpacity activeOpacity={0.9} style={styles.container} onPress={handleRedirect}>
            <TouchableOpacity activeOpacity={0.7} style={{borderRadius:50, overflow:"hidden"}}>
                <Ionicons name="person-circle" size={80} color={Colors[theme].disabled} />
            </TouchableOpacity>
            <View style={{flex:1}}>
                <Text style={[styles.username, { color: Colors[theme].text }]}>{userChat.name}</Text>
                <View className="last-message" style={{flexDirection:"row", alignItems:"center", gap:3}}>
                    <Text style={[styles.message, { color:Colors[theme].disabled }]}>{renderLastMessage()}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container:{
        paddingHorizontal:10,
        paddingVertical:5,
        borderBottomWidth:1,
        borderBottomColor:"lightgray",
        flexDirection:"row",
        alignItems:"center",
        gap:10
    },
    username:{
        fontSize:20,
        fontWeight:"bold",
    },
    message:{
        fontSize:16,
    }
})