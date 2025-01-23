import CustomHeaderChat from "@/components/chats/CustomHeaderChat";
import { ChatProvider } from "@/context/ChatProvider";
import { UserModel } from "@/core/models/UserModel";
import { getChatById } from "@/core/services/chats";
import { getUserById } from "@/core/services/user";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";

export default function Layout() {
    const [userChat, setUserChat] = useState<UserModel | null>(null);

    const fetchUserChat = async (chatId: String): Promise<UserModel | any> => {
        try {
            const user = await AsyncStorage.getItem("user");
            // @ts-ignore
            const chat = await getChatById(chatId);
            if (chat) {
                const userChat = await getUserById(
                    // @ts-ignore
                    chat.userOne === user.uid ? chat.userTwo : chat.userOne
                );
                return userChat;
            }
        } catch (error) {
            console.log("Error located at fetchUser", error);
            return null;
        }
    };

    return (
        <Stack>
            <Stack.Screen
                name="[chatId]"
                // @ts-ignore
                options={({ route }) => {
                    // Get the userId from the route params
                    // @ts-ignore
                    const { chatId: chatIdRoute } = route.params;
                    useEffect(() => {
                        fetchUserChat(chatIdRoute).then((user) =>
                            setUserChat(user)
                        );
                    }, [chatIdRoute]);

                    return {
                        presentation: "modal",
                        headerTitle: userChat?.name,
                        header: (props) => {
                            return (
                                <CustomHeaderChat
                                    {...props}
                                    chatId={chatIdRoute}
                                />
                            );
                        },
                    };
                }}
            />
        </Stack>
    );
}
