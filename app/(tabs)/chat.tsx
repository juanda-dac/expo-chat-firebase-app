import { useEffect, useState } from "react";
import { FlatList, ListRenderItem, Text, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ChatItemList from "@/components/chats/ChatItemList";
import { getLastMessageByChatId, getUserChats } from "@/core/services/messages";
import { fetchUserFromAsyncStorage, getUserById } from "@/core/services/user";
import { ChatModel } from "@/core/models/ChatModel";
import { collection, getFirestore, onSnapshot } from "firebase/firestore";
import { app } from "@/constants/firebase";
import { MessageModel } from "@/core/models/MessageModel";
import { ChatItemProps } from "@/core/models/props/ChatItemProps";
import { UserModel } from "@/core/models/UserModel";

interface ChatInternModel{
    chat: ChatModel,
    lastMessage: MessageModel,
}

export default function Chat(){

    const [chats, setChats] = useState<Array<ChatModel>>([]);
    const [user, setUser] = useState<UserModel>({} as UserModel); // User owner
    const firestore = getFirestore(app);

    const fetchChats = async () => {
        const userFetch = await fetchUserFromAsyncStorage() as UserModel;
        setUser(userFetch);
        // fetch chats
        const chatsFetch = await getUserChats(userFetch.uid);
        // Order data
        setChats(chatsFetch);
    }

    useEffect(() => {
        fetchChats();
    }, []);

    const renderItem = ({ item }:{ item:ChatModel }):Promise<any> => {
        return new Promise(async (resolve, reject) => {
            const userChat = await getUserById(item.userOne === user.uid ? item.userTwo : item.userOne);
            resolve(
                <ChatItemList chat={item} userChat={userChat as UserModel} currentUser={user} />
            );
        });
        
    }

    return (
        <View>    
            <FlatList 
                data={chats}
                // @ts-ignore
                renderItem={(item:any) => renderItem(item)}
                keyExtractor={(item, index) => index.toString()}
            />
        </View>
    );
}