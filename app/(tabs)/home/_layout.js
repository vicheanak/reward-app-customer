import { Stack } from "expo-router"
const red = 'rgba(199, 43, 98, 1)';
const yellow = '#ffc107';
const white = '#fff';

const StackLayout = () => {
    return (
        <Stack>
            <Stack.Screen name="index" options={{
                headerTitle: 'Reward App',
                headerTintColor: red,
                headerTitleStyle: {
                    fontSize: 20
                },
                headerStyle: {
                    backgroundColor: yellow,
                },
            }}/>
        </Stack>
    )
}

export default StackLayout;