import { MessageModel } from "@/core/models/MessageModel";
import { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ChatModel } from "@/core/models/ChatModel";
import {
    getMessagesByChatId,
    sendMessage,
    deleteMessageFromTemporalCollection,
    sendMessageToTemporalCollection,
} from "@/core/services/messages";
import { collection, getFirestore, onSnapshot } from "firebase/firestore";
import { app } from "@/constants/firebase";
import { getChatById } from "@/core/services/chats";

interface ChatContextModel {
    messages: Array<MessageModel>;
    activeChat: ChatModel;
    setChat: (chatId: string) => void;
    setMessages: (messages: Array<MessageModel>) => void;
    addMessage: (message: MessageModel) => void;
    deleteMessage: (messageId: string) => void;
}

const ChatContext = createContext({} as ChatContextModel);

export function ChatProvider({ children }: any) {
    const [messages, setMessages] = useState<Array<MessageModel>>([]);
    const [activeChat, setActiveChat] = useState<ChatModel>({} as ChatModel);
    const [loadingChat, setLoadingChat] = useState<boolean>(false);
    // verify if the message is from the sender
    const [senderMessage, setSenderMessage] = useState<boolean>(false);

    const firestore = getFirestore(app);
    const messagesCollection = collection(firestore, "messages");
    const tempMessagesCollection = collection(firestore, "tmpMessages");

    // UseEffect to listen to the messages collection
    useEffect(() => {
    }, []);

    useEffect(() => {
        /**
         * Fetching messages from the local storage for the active chat, but if there is empty, fetch from the database
         */
        const fetchMessagesByChatId = async () => {
            setLoadingChat(true);
            try {
                // Attempt to get messages from the local storage
                const messages = await AsyncStorage.getItem(
                    `messages:${activeChat.id}`
                );
                if (!messages && activeChat.id) {
                    // Fetch messages from the database if there is no messages in the local storage
                    const messages = await getMessagesByChatId(
                        activeChat.id as string
                    );
                    await AsyncStorage.setItem(
                        `messages:${activeChat.id}`,
                        JSON.stringify(messages)
                    );
                    setMessages(messages);
                    console.log("Messages fetched from the database");
                } else {
                    console.log("Messages fetched from the local storage");
                    setMessages(JSON.parse(messages as string));
                }
            } catch (error) {
                console.log("Error located at fetchMessagesByChatId", error);
            } finally{
                console.log("Finally");  
                setLoadingChat(false);
            }
        };
        
        fetchMessagesByChatId();
    }, [activeChat]);

    const setChat = async (chatId: string) => {
        try {
            const chat = await getChatById(chatId);
            setActiveChat(chat as ChatModel);
        } catch (error) {
            console.log("Error located at setChat", error);
        }
    };

    const addMessage = async (message: MessageModel) => {
        setSenderMessage(true);
        await AsyncStorage.setItem(
            `messages:${activeChat.id}`,
            JSON.stringify([...messages, message])
        );
        setMessages([...messages, message]);
        // Send Message to the database
        await sendMessage(message);
        // Send Message to the temporal collection
        await sendMessageToTemporalCollection(message);
    };

    const deleteMessage = async (messageId: string) => {
        setMessages((prev) =>
            prev.filter((message) => message.id !== messageId)
        );
        await AsyncStorage.setItem(
            `messages:${activeChat.id}`,
            JSON.stringify(
                messages.filter((message) => message.id !== messageId)
            )
        );
    };

    return (
        <ChatContext.Provider
            value={{
                messages,
                activeChat,
                setChat,
                setMessages,
                addMessage,
                deleteMessage,
            }}
        >
            {children}
        </ChatContext.Provider>
    );
}

export const useUserChat = () => useContext(ChatContext);
