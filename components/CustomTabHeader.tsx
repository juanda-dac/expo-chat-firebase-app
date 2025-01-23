
import { BottomTabHeaderProps } from "@react-navigation/bottom-tabs";
import { Text, View, StyleSheet, Dimensions } from "react-native";

export default function CustomTabHeader(props: BottomTabHeaderProps) {
    return (
        <View style={styles.containerHeader}>
            <Text style={styles.title}>{props.options.title}</Text>
        </View>
    );
}


const styles=StyleSheet.create({
    containerHeader:{
        width: Dimensions.get('window').width,
        padding: 20,
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
        backgroundColor: '#fff',
    },
    title:{},
    icon:{}
})