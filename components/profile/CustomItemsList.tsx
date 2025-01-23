import { StyleSheet, Text, View, FlatList, Touchable, TouchableOpacity, Dimensions } from "react-native";
import { Href, router } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Icon } from "@expo/vector-icons/build/createIconSet";
import Consts from "@/constants/Colors";

interface Item {
    id:number;
    title:string;
    to: Href;
    icon?:any;
}

export default function CustomItemsList(){

    const items:Array<Item> = [{
        id:1,
        title:"Notifications",
        to:"/(tabs)/chat",
        icon: "notifications-outline",
    },{
        id:2,
        title:"Languaje",
        to:"/(tabs)/chat",
        icon: "language-outline",
    },{
        id:3,
        title:"Privacy",
        to:"/(tabs)/chat",
        icon: "shield-checkmark-outline",
    }];

    return (
        <View>
            <FlatList
                data={items}
                renderItem={({item})=>(
                    <Item title={item.title} to={item.to} icon={item.icon} id={item.id} />
                )}
            />
        </View>
    )
}

function Item({title, to, icon}:Item){

    const handlePress = () => {
        router.replace(to);
    }

    return <TouchableOpacity onPress={handlePress} activeOpacity={0.6} style={stylesItem.container}>
        <View style={stylesItem.itemList}>
            <View style={stylesItem.icon}>
                <Ionicons name={icon} size={24} color={Consts.light.tint} />
            </View>
            <Text style={stylesItem.title}>
                {title}
            </Text>
        </View>
        <View style={stylesItem.rightIcon}>
            <Ionicons name="chevron-forward" size={24} color={Consts.light.tint} />
        </View>
    </TouchableOpacity>
}

const styles = StyleSheet.create({
    container:{},
    itemList:{},
})


const stylesItem = StyleSheet.create({
    container:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 8,
        paddingVertical:16,
        paddingHorizontal: 20,
        width: Dimensions.get("window").width,
        borderBottomWidth: 1,
        borderBottomColor: Consts.light.tabIconDefault,
    },
    title:{
        fontSize: 16,
        fontWeight: 'bold',
        color: Consts.light.tint,
    },
    icon:{
        paddingRight: 8,
    },
    itemList:{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    rightIcon:{
        justifyContent: 'flex-end',
    },
})