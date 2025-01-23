import { useEffect, useState } from "react";
import {
    Button,
    Text,
    View,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "@expo/vector-icons/Ionicons";
import CustomItemsList from "@/components/profile/CustomItemsList";
import { useAppAuth } from "@/context/AuthContext";
import { UserModel } from "@/core/models/UserModel";
import Colors from "@/constants/Colors";
import CustomImageProfile from "@/components/profile/CustomImageProfile";


export default function Profile() {
    const { logout, error, setError } = useAppAuth();
    const [user, setUser] = useState<UserModel>({} as UserModel);
    const [errorState, setErrorState] = useState("");

    const handleLogout = async () => {
        await AsyncStorage.removeItem("user");
        logout();
    };

    useEffect(() => {
        AsyncStorage.getItem("user")
            // @ts-ignore
            .then((user) => setUser(JSON.parse(user)))
            .catch((error) => setErrorState(error));
    }, []);

    useEffect(() => {
        if(error || errorState){
            Alert.alert("Error", error || errorState);
        }
    }, [errorState, error]);

    return (
        <View style={styles.container}>
            <View className="header" style={styles.header}>
                <View className="left">
                    <CustomImageProfile />
                </View>
                <View className="right" style={styles.containerProfile}>
                    <Text style={styles.username}>{user.name}</Text>
                    <View
                        style={{
                            flexDirection: "row",
                            gap: 10,
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <Text style={styles.userInfo}>{user.phone}</Text>
                        <Text style={styles.userInfo}>{user.email}</Text>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            className="logout"
                            onPress={handleLogout}
                        >
                            <Ionicons
                                style={{ transform: "rotateY(180deg)" }}
                                name="log-out-outline"
                                size={20}
                                color={Colors.light.tint}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <View className="body">
                <CustomItemsList />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {},
    containerProfile: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    header: {
        // backgroundColor: Colors.light.background,
        // boxShadow: '0 0px 5px rgba(0,0,0,0.6)',
        // borderBottomColor: Colors.light.tabIconDefault,
        // borderBottomWidth: 1,
        padding: 20,
        flexDirection: "row",
        width: "100%",
    },
    containerImage: {
        width: 100,
        height: 100,
        marginBottom: 20,
    },
    username: {
        fontSize: 34,
        fontWeight: "bold",
        textAlign: "center",
    },
    userInfo: {
        fontSize: 12,
    },
    link: {},
});
