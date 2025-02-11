
import { BottomTabHeaderProps } from "@react-navigation/bottom-tabs";
import { Text, View, StyleSheet, Dimensions, useColorScheme } from "react-native";
import { MonBoldText } from "./styled/StyledText";
import Colors from "@/constants/Colors";

export default function CustomTabHeader(props: BottomTabHeaderProps) {

    const theme = useColorScheme() || "light";

    return (
        <View style={[styles.containerHeader, { backgroundColor: Colors[theme].backgroundDk }]}>
            <MonBoldText style={[styles.title, { color: Colors[theme].primary }]}>{props.options.title}</MonBoldText>
        </View>
    );
}


const styles=StyleSheet.create({
    containerHeader:{
        width: Dimensions.get('window').width,
        padding: 20,
    },
    title:{
        fontSize: 20,
        color: '#000',
        textAlign: 'center',
    },
    icon:{}
})