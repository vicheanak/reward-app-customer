import { Redirect, useRootNavigationState, useRouter, SplashScreen } from "expo-router";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomePage from "./(tabs)/home";
import {useState, useEffect, useMemo} from "react";
import { onAuthStateChanged } from "firebase/auth";
import { FIREBASE_AUTH } from "../firebaseConfig";
import { Text, View } from "react-native";
const navigationState = useRootNavigationState();
const Stack = createNativeStackNavigator();

const StartPage = () => {
  const router = useRouter();
  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, (user) => {
      if (user !== null){
        router.replace("/(tabs)/home");
      } else {
        router.replace("/screens/Login");
      }
    })
    // router.replace("/screens/List");
  }, [])

  return <SplashScreen />
}

export default StartPage;