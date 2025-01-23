import Colors from "@/constants/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, Text, TouchableOpacity, useColorScheme, View } from "react-native";
import { EventEmitter, useEvent, useEventListener } from "expo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";

export default function CustomHeaderChat(props:any) {

    const theme = useColorScheme() || "light";
    
    const { chatId } = props;
    const eventEmitter = new EventEmitter();

    // @ts-ignore
    useEventListener(eventEmitter, 'adding', (status:any)=>{
        console.log("Listening...");
    })

    const handleDeleteChat = async () => {
        await AsyncStorage.removeItem(`messages:${chatId}`);
        console.log(await AsyncStorage.getItem(`messages:${chatId}`));
        
        // @ts-ignore
        eventEmitter.emit('adding' as never, {status: "deleting"});
    }

    return (
        <View style={[styles.container, { backgroundColor: Colors[theme].background, borderBottomColor: Colors[theme].tint }]}>
            <View>
                <TouchableOpacity activeOpacity={0.8} onPress={() => props.navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color={Colors[theme].text} />
                </TouchableOpacity>
            </View>
            <Text style={[styles.title, { color: Colors[theme].text }]}>{props.options.headerTitle}</Text>
            <View>
                <TouchableOpacity activeOpacity={0.8} onPress={handleDeleteChat}>
                    <Ionicons name="trash" size={24} color={Colors[theme].text} />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 10,
        paddingVertical: 15,
        borderBottomWidth: 1,
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        height: 60,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
    },
});