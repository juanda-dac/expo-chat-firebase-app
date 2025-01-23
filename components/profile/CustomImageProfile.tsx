import { Image, View, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import Consts from "@/constants/Colors";

interface CustomImageProfileProps{
    image?: string;
    avatar?: boolean;
}

export default function CustomImageProfile({ image, avatar=true }: CustomImageProfileProps){
    return(
        <View style={styles.container}>
            {
                image && <Image style={styles.image} source={{ uri:"" }} />
            }
            {
                <Ionicons name="person-circle" size={100} color={Consts.light.light} />
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        width: 100,
    },
    image:{
        width: 100,
        height: 100,
        borderRadius: 50,
    },
})
