import { StyleSheet, TextInput, useColorScheme, View } from "react-native";
import { MonBoldText } from "../styled/StyledText";
import Ionicons from "@expo/vector-icons/Ionicons";
import Colors from "@/constants/Colors";

export default function HeaderChatList() {

    const theme = useColorScheme() || "light";

    return (
        <View style={[styles.container, { borderBottomColor: Colors[theme].border, backgroundColor: Colors[theme].backgroundDk }]}>
            <SearchBarWrapper>
                <LeftIconSearchBar>
                    <Ionicons name="search" size={24} color={Colors[theme].border} />
                </LeftIconSearchBar>
                <TextInput placeholder="Type a username..." inputMode="search" autoComplete="off" autoCorrect={false} placeholderTextColor={Colors[theme].text} style={[styles.searchBar, { backgroundColor:Colors[theme].backgroundLg, borderColor: Colors[theme].border, color:Colors[theme].primary }]} />
            </SearchBarWrapper>
        </View>
    );
}


function SearchBarWrapper({ children }: { children: React.ReactNode }) {
    return (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
            {children}
        </View>
    )
}

function LeftIconSearchBar({ children }: { children: React.ReactNode }) {
    return (
        <View style={{ position: "absolute", left: 10, zIndex: 1 }}>
            {children}
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
    },
    searchBar: {
        borderWidth: 1,
        width: "100%",
        paddingHorizontal: 40,
        fontFamily: "Montserrat",
        borderRadius: 10,
    },
})

