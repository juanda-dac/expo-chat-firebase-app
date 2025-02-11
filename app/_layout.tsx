import { AuthProvider } from "@/context/AuthContext";
import { Stack } from "expo-router";
import { Montserrat_400Regular, Montserrat_700Bold, Montserrat_400Regular_Italic, Montserrat_700Bold_Italic, Montserrat_500Medium } from "@expo-google-fonts/montserrat"
import { useFonts } from "expo-font";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import React, { useEffect } from "react";
import { useColorScheme } from "react-native";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import * as SplashScreen from "expo-splash-screen";

export default function MainLayout() {

    const [loaded, error] = useFonts({
        SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
        Montserrat: Montserrat_400Regular,
        MontserratMedium: Montserrat_500Medium,
        MontserratBold: Montserrat_700Bold,
        MontserratItalic: Montserrat_400Regular_Italic,
        MontserratBoldItalic: Montserrat_700Bold_Italic,
        ...FontAwesome.font
    })

    const colorScheme = useColorScheme();

    SplashScreen.preventAutoHideAsync();

    useEffect(() => {
        if(loaded){
            console.log("Fonts loaded");
            SplashScreen.hideAsync();
        }
    }, [loaded]);

    useEffect(() => {
        console.log("Color scheme changed to", colorScheme);    
    }, [colorScheme]);

    
    

    return (
        <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
            <AuthProvider>
                <Stack screenOptions={{ headerShown:false }} />
            </AuthProvider>
        </ThemeProvider>
    );
}
