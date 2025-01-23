import { AuthProvider, useAppAuth } from "@/context/AuthContext";
import { Stack, router, Slot } from "expo-router";
import React, { useEffect } from "react";

export default function AuthLayout() {

    return (
        <Stack>
            <Stack.Screen name="login" options={{ headerTitle:"Login" }}></Stack.Screen>
            <Stack.Screen name="register" options={{ headerTitle:"Register" }}></Stack.Screen>
        </Stack>
    );
}
