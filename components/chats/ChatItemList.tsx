import Ionicons from "@expo/vector-icons/Ionicons";
import { Href, router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, useColorScheme, View } from "react-native";
import Colors from "@/constants/Colors";
import { MessageModel } from "@/core/models/MessageModel";
import { UserModel } from "@/core/models/UserModel";
import { ChatItemProps } from "@/core/models/props/ChatItemProps";

export default function ChatItemList({ chat, lastMessage, userChat }:ChatItemProps){

    const handleRedirect = () => router.push(`../(chat)/${chat.id}`);
    const theme = useColorScheme() || "light";

    return (
        <TouchableOpacity activeOpacity={0.9} style={styles.container} onPress={handleRedirect}>
            <TouchableOpacity activeOpacity={0.7} style={{borderRadius:50, overflow:"hidden"}}>
                <Ionicons name="person-circle" size={80} color={Colors[theme].disabled} />
            </TouchableOpacity>
            <View style={{flex:1}}>
                <Text style={[styles.username, { color: Colors[theme].text }]}>{userChat.name}</Text>
                <View className="last-message" style={{flexDirection:"row", alignItems:"center", gap:3}}>
                    <Text style={[styles.message, { color:Colors[theme].disabled }]}>Last message</Text>
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