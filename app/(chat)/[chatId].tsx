import ChatColors from "@/constants/ChatColors";
import { MessageModel } from "@/core/models/MessageModel";
import { UserModel } from "@/core/models/UserModel";
import Ionicons from "@expo/vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSearchParams } from "expo-router/build/hooks";
import {
    addDoc,
    collection,
    doc,
    getDocs,
    orderBy,
    query,
    Timestamp,
} from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import {
    Dimensions,
    StyleSheet,
    Text,
    TextInput,
    View,
    KeyboardAvoidingView,
    Platform,
    FlatList,
    useColorScheme,
    TouchableOpacity,
    Keyboard,
} from "react-native";
import { onSnapshot, getFirestore } from "firebase/firestore";
import { app } from "@/constants/firebase";
import Colors from "@/constants/Colors";
import { EventEmitter } from "expo";
import { ChatModel } from "@/core/models/ChatModel";
import { getChatById } from "@/core/services/chats";
import { fetchUserFromAsyncStorage, getUserById } from "@/core/services/user";

export default function ChatUserId() {
    // Consts
    const firestore = getFirestore(app);

    const params = useSearchParams();
    const [chatRoom, setChatRoom] = useState<ChatModel>({} as ChatModel);
    const [user, setUser] = useState<UserModel | null>(null);
    const [userChat, setUserChat] = useState<UserModel | null>(null);
    const [loadingChat, setLoadingChat] = useState<number>(0);
    const [message, setMessage] = useState<string>("");
    const [messages, setMessages] = useState<Array<MessageModel>>([]);
    const listRef = useRef<FlatList>(null);
    // const theme = 'light';
    const theme = useColorScheme() || "light";

    useEffect(() => {
        const fetchUser = async () =>
            setUser(await fetchUserFromAsyncStorage());
        fetchUser();
    }, []);

    useEffect(() => {
        const chatId = params.get("chatId");

        const fetchChatRoom = async () => {
            if (!chatId) return;

            try {
                const chat = await getChatById(chatId);
                if (!chat) return;

                const userChatId = chat.userOne === user?.uid ? chat.userTwo : chat.userOne;
                const userChat = await getUserById(userChatId);
                setUserChat(userChat as UserModel);
                setChatRoom(chat as ChatModel);

                const docRef = doc(firestore, "chats", chat.id as string);
                const q = query(collection(docRef, "messages"), orderBy("date", "asc"));

                const storedMessages = await AsyncStorage.getItem(`messages:${chat.id}`);
                if (storedMessages && loadingChat === 0) {
                    setMessages(JSON.parse(storedMessages));
                    console.log("Stored messajes: ", storedMessages);
                    setLoadingChat(loadingChat + 1);
                } else {
                    const docs = await getDocs(q);
                    const fetchedMessages = docs.docs.map(doc => ({id: doc.id, ...doc.data()} as MessageModel));
                    setMessages(fetchedMessages);
                    await AsyncStorage.setItem(`messages:${chat.id}`, JSON.stringify(fetchedMessages));
                    console.log("Fetched messages: ", fetchedMessages);
                    setLoadingChat(loadingChat + 1);
                }

                
                const unsub = onSnapshot(q, async (querySnapshot) => {
                    if (messages.length === 0) {
                        console.log("Loading chat, yet...", messages.length);
                        return;
                    }
                    const newMessages: MessageModel[] = querySnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    } as MessageModel));                    

                    if (newMessages.length > messages.length) {
                        const newMessage = newMessages[newMessages.length - 1];
                        setMessages(prevMessages => [...prevMessages, newMessage]);
                        AsyncStorage.setItem(`messages:${chat.id}`, JSON.stringify([...messages, newMessage]));
                        return;
                    }
                });

                return unsub;
            } catch (error) {
                console.error("Error fetching chat room: ", error);
            }
        };

        fetchChatRoom();
    }, []);

    useEffect(() => {
        const storeMessages = async () => {
            console.log("Messages state: ", messages.length);
            console.log("Messages local storage: ", JSON.parse(await AsyncStorage.getItem(`messages:${chatRoom.id}`) as string).length);
        }
        storeMessages();        
    }, [messages]);


    useEffect(() => {
        setTimeout(() => {
            listRef.current?.scrollToEnd({ animated: true });
        }, 300);
    }, [messages]);

    const handleSendMessage = async () => {
        Keyboard.dismiss();
        if (!message.trim()) {
            setMessage("");
            return;
        }
        const newMessage: MessageModel = {
            chatId: chatRoom.id as string,
            text: message.trim(),
            sender: user?.uid as string,
            receiver: userChat?.uid as string,
            status: "sent",
            date: Timestamp.now(),
        };
        setMessage("");
        setMessages([...messages, newMessage]);
        await addDoc(
            collection(doc(firestore, "chats", newMessage.chatId), "messages"),
            newMessage
        );
        AsyncStorage.setItem(`messages:${chatRoom.id}`, JSON.stringify([...messages, newMessage]));
    };

    const renderItem = ({ item }: { item: MessageModel }) => {
        const isUserMessage = item.sender === user?.uid;
        // @ts-ignore
        const dateTimestamp = new Timestamp(item.date.seconds, item.date.nanoseconds);

        return (
            <View
                style={[
                    styles.messagesBox,
                    { alignItems: isUserMessage ? "flex-end" : "flex-start" },
                ]}
                key={item.id}
            >
                <View
                    style={{
                        maxWidth: "80%",
                        backgroundColor: isUserMessage
                            ? Colors[theme].primary
                            : ChatColors[theme].light,
                        padding: 10,
                        borderRadius: 5,
                        margin: 5,
                    }}
                >
                    <Text style={{ color: isUserMessage ? ChatColors.white : ChatColors[theme].text }}>
                        {item.text}
                    </Text>
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            gap: 5,
                        }}
                    >
                        <Text
                            style={[
                                styles.timestamp,
                                { color: isUserMessage ? ChatColors.white : ChatColors[theme].text },
                            ]}
                        >
                            {dateTimestamp
                                .toDate()
                                .toLocaleTimeString("en-US", {
                                    hour: "numeric",
                                    minute: "2-digit",
                                })}
                        </Text>
                        {/* @ts-ignore */}
                        {/* <Ionicons name={isUserMessage && item.status === "read" ?  "checkmark-circle" : isUserMessage && item.status === "sent" || item.status === "received" ? "checkmark-circle-outline" : null} size={16} color={ChatColors[theme].text} /> */}
                    </View>
                </View>
            </View>
        );
    };

    return (
        <KeyboardAvoidingView
            style={[
                styles.container,
                { backgroundColor: Colors[theme].backgroundDk },
            ]}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={0}
        >
            <FlatList
                ref={listRef}
                data={messages}
                renderItem={renderItem}
                ListFooterComponent={<View style={{ padding: 0 }} />}
            />

            <View style={styles.inputWrapper}>
                <View style={{ flexDirection: "row", flex: 1 }}>
                    <TextInput
                        placeholder="Escribe un mensaje..."
                        placeholderTextColor={Colors[theme].text}
                        multiline
                        value={message}
                        onChangeText={(text) => setMessage(text)}
                        style={[
                            styles.input,
                            {
                                backgroundColor: Colors[theme].bgPrimary,
                                color: ChatColors[theme].text,
                                borderColor: Colors[theme].primary,
                            },
                        ]}
                    />
                </View>
                <View style={{ justifyContent: "flex-end" }}>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={handleSendMessage}
                        style={[
                            styles.buttonOptions,
                            { backgroundColor: Colors[theme].primary },
                        ]}
                    >
                        <Ionicons
                            name="send"
                            size={24}
                            color={ChatColors.white}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    messagesBox: {
        paddingHorizontal: 10,
    },
    inputWrapper: {
        paddingHorizontal: 10,
        paddingVertical: 10,
        marginBottom: 30,
        flexDirection: "row",
        gap: 10,
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 40,
    },
    buttonOptions: {
        padding: 10,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
    },
    timestamp: {
        fontSize: 10,
        textAlign: "right",
        marginTop: 5,
        justifyContent: "center",
        alignItems: "center",
    },
});
