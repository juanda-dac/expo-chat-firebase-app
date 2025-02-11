import { Text } from "react-native";

export function MonText(props:any){
    return (<Text {...props} style={[props.style, { fontFamily:'Montserrat' }]} />)
}

export function MonBoldText(props:any){
    return (<Text {...props} style={[props.style, { fontFamily:'MontserratBold' }]} />)
}

export function MonLightText(props:any){
    return (<Text {...props} style={[props.style, { fontFamily:'MontserratLight' }]} />)
}

export function MonMediumText(props:any){
    return (<Text {...props} style={[props.style, { fontFamily:'MontserratMedium' }]} />)
}