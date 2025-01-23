import { useAppAuth } from "@/context/AuthContext";
import { router, Tabs } from "expo-router";
import React, { useEffect } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Text, TouchableOpacity, View } from "react-native";
import CustomTabBarButton from "@/components/CustomTabBarButton";
import CustomTabHeader from "@/components/CustomTabHeader";

export default function TabLayout() {

    return (
        <Tabs screenOptions={{
            animation:"shift"    
        }}>
            <Tabs.Screen
                name="chat"
                options={{
                    title: "SimplyChat",
                    headerBackButtonDisplayMode: "minimal",
                    // header: (props)=> <CustomTabHeader {...props}/>,
                    tabBarIcon: ({ color, size, focused }) => (
                        <Ionicons
                            name={focused ? "chatbubble-ellipses" : "chatbubble-ellipses-outline"}
                            color={color}
                            size={size}
                        />
                    ),
                    tabBarButton:(props)=>(<CustomTabBarButton {...props}/>),
                }}
            />

            <Tabs.Screen name="chat/[userId]" options={{ href:null }}/>

            <Tabs.Screen 
                name="profile"
                options={{
                    headerShown: false,
                    title: "Profile",
                    tabBarIcon: ({ color, size, focused }) => (
                        <Ionicons
                            name={focused ? "person-circle" : "person-circle-outline"}
                            color={color}
                            size={size}
                        />
                    ),
                    tabBarButton:(props)=>(<CustomTabBarButton {...props}/>),
                }}
            />

            <Tabs.Screen
                name="home"
                options={{
                    title: "Home",
                    href: null, // This disables the tab
                    tabBarIcon: ({ color, size, focused }) => (
                        <Ionicons
                            name={focused ? "home" : "home-outline"}
                            size={size}
                            color={color}
                        />
                    ),
                    tabBarLabelStyle: { fontSize: 12 },
                    // tabBarBadge: 3,
                }}
            />
        </Tabs>
    );
}
