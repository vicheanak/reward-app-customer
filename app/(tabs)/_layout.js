import { Tabs } from "expo-router"
import { Feather, Ionicons } from "@expo/vector-icons";
import { Colors } from 'react-native';
const red = 'rgba(199, 43, 98, 1)';
const yellow = '#ffc107';
const white = '#fff';

export default () => {
    return (
        <Tabs>
            <Tabs.Screen name="home" options={{
                headerShown: false,
                tabBarShowLabel: false,
                tabBarActiveTintColor: red,
                tabBarInactiveTintColor: yellow,
                tabBarStyle: {
                    backgroundColor: yellow
                },
                tabBarIcon: (props) => {
                    return (
                        <Ionicons name={props.focused ? 'home' : 'home-outline'} color={red} size={25} />
                    )
                }
                }} />
            <Tabs.Screen name="profile" options={{
                headerShown: false,
                tabBarShowLabel: false,
                tabBarActiveTintColor: red,
                tabBarInactiveTintColor: yellow,
                tabBarStyle: {
                    backgroundColor: yellow
                },
                tabBarIcon: (props) => (<Ionicons name={props.focused ? 'person' : 'person-outline'} color={red} size={25} />)
                }} />
        </Tabs>
    )
}