import React, { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';
import { useAppAuth } from '@/context/AuthContext';

export default function CustomRedirectPage() {

    const { authenticated } = useAppAuth();
    const [route, setRoute] = useState("");

    useEffect(() => {
        if (authenticated){
            setRoute("/(tabs)/home");
            return;
        }
        setRoute("/(auth)/login");
    }, []);

    return (
    
        <Redirect href={route} />
    );
}

