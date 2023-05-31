import { Stack } from "expo-router"
import { onAuthStateChanged } from "firebase/auth";
import { FIREBASE_AUTH } from "../firebaseConfig";
import {useState, useEffect} from "react";

const StackLayout = () => {
    
    return (
        <Stack>
            <Stack.Screen name="(tabs)" options={{
            gestureEnabled: false,
            headerShown: false
            }}/>
            <Stack.Screen name="screens/Login" options={{
            gestureEnabled: false,
            headerShown: false
            }}/>
        </Stack>
    )
}

export default StackLayout;