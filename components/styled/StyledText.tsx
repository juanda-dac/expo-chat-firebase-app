import { Text } from "react-native";

export function MonText(props:any){
    return (<Text {...props} style={[props.style, { fontFamily:'Montserrat' }]} />)
}