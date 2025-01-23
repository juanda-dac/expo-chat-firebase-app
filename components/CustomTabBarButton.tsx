import { BottomTabBarButtonProps } from "@react-navigation/bottom-tabs";
import { TouchableOpacity } from "react-native";

export default function CustomTabBarButton(props:BottomTabBarButtonProps) {
    return (
        <TouchableOpacity style={props.style} onPress={props.onPress} activeOpacity={0.7}>
            {props.children}
        </TouchableOpacity>
    )
}