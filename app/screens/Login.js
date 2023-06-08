import { StyleSheet, View, TextInput, ActivityIndicator, Alert, KeyboardAvoidingView } from 'react-native'
import React, { useState } from 'react'
import { FIREBASE_AUTH, FIREBASE_DB, FACEBOOK_AUTH } from '../../firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, FacebookAuthProvider, signInWithPopup, getAuth } from 'firebase/auth';
import { Stack, useRouter } from "expo-router";
import { Button, ButtonGroup, withTheme, Text, Input } from '@rneui/themed';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { getDatabase, ref, set, onValue, update, remove, push } from "firebase/database";
const auth = getAuth();

const red = 'rgba(199, 43, 98, 1)';
const yellow = '#ffc107';
const white = '#fff';
const db = FIREBASE_DB;

const Login = ({navigation}) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const auth = FIREBASE_AUTH;
    const router = useRouter();
    const [isEmailValid, setIsEmailValid] = useState(true);
    const [isPasswordValid, setIsPasswordValid] = useState(true);
    

    const signIn = async () => {
        setLoading(true);
        // signInWithPopup(auth, FACEBOOK_AUTH)
        // .then((result) => {
        //   // The signed-in user info.
        //   const user = result.user;
      
        //   // This gives you a Facebook Access Token. You can use it to access the Facebook API.
        //   const credential = FacebookAuthProvider.credentialFromResult(result);
        //   const accessToken = credential.accessToken;
      
        // })
        // .catch((error) => {
        //   console.log({error});
        // });

        try{
            const response = await signInWithEmailAndPassword(auth, email, password);
            const user = auth.currentUser;
            if (user.email == 'admin@rewardapp.com'){
                Alert.alert("You're not a customer!")
            } else {
                router.replace("/(tabs)/home");
            }
        } catch (error) {
            Alert.alert("Sign In Failed");
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    const signUp = async () => {
        setLoading(true);
        try{
            //Find Email first
            const response = await createUserWithEmailAndPassword(auth, email, password);
            console.log({response});
            // const userRef = push(ref(db, 'users/'));
            
            await signInWithEmailAndPassword(auth, email, password);
            const user = auth.currentUser;
            const userRef = ref(db, 'users/' + user.uid);
            set(userRef, {
                email: email,
                name: name ? name : "Customer",
                stamps: 0
            })
            // router.replace("/(tabs)/home");
        } catch (error) {
            Alert.alert("Signed Up Failed", error.message);
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    const ValidateEmail = (mail) => {
        if ((/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)))
        {
            return (true)
        }
        return (false)
    }

    const ValidatePassword = (password) => {
        if (password.length >= 6){
            return (true)
        }
        return (false)
    }

    return (
        <View style={styles.container}>
            <KeyboardAvoidingView behavior='padding'>
                <Input
                    containerStyle={{}}
                    inputContainerStyle={styles.inputContainerStyle}
                    inputStyle={{}}
                    // autoCapitalize='yes'
                    // label="User Form"
                    labelStyle={{}}
                    labelProps={{}}
                    leftIcon={<Icon name="account" size={25} />}
                    leftIconContainerStyle={{}}
                    placeholder="Name"
                    onChangeText={(text) => {
                        setName(text)
                    }}
                    />
                <Input
                    containerStyle={{}}
                    inputContainerStyle={styles.inputContainerStyle}
                    errorMessage={isEmailValid ? "" : "Invalid Email"}
                    errorStyle={{marginLeft: 20, fontSize: 15}}
                    errorProps={{}}
                    inputStyle={{}}
                    autoCapitalize='none'
                    // label="User Form"
                    labelStyle={{}}
                    labelProps={{}}
                    leftIcon={<Icon name="email" size={25} />}
                    leftIconContainerStyle={{}}
                    placeholder="Email"
                    onChangeText={(text) => {
                        let isValid = ValidateEmail(text);
                        setIsEmailValid(isValid);
                        setEmail(text)
                    }}
                    />
                    <Input
                    containerStyle={{}}
                    inputContainerStyle={styles.inputContainerStyle}
                    errorMessage={isPasswordValid ? "" : "Invalid Password"}
                    errorStyle={{marginLeft: 20, fontSize: 15}}
                    inputStyle={{}}
                    autoCapitalize='none'
                    // label="User Form"
                    labelStyle={{}}
                    labelProps={{}}
                    leftIcon={<Icon name="asterisk" size={25} />}
                    leftIconContainerStyle={{}}
                    placeholder="Password"
                    onChangeText={(text) => {
                        let isValid = ValidatePassword(text);
                        setIsPasswordValid(isValid);
                        setPassword(text)
                    }}
                    secureTextEntry={true}
                    />
                {loading ? 
                <ActivityIndicator size="large" color="#000000" /> 
                : <>
                <Button
                    title="SIGN UP"
                    titleStyle={styles.signUpButtonTitleStyle}
                    type="outline"
                    disabled={!isEmailValid || !isPasswordValid || !email.length || !password.length}
                    raised
                    buttonStyle={styles.signUpButtonStyle}
                    containerStyle={styles.buttonContainer}
                    onPress={signUp} />
               <Button
                    title="SIGN IN"
                    titleStyle={styles.buttonTitleStyle}
                    type="outline"
                    disabled={!isEmailValid || !isPasswordValid || !email.length || !password.length}
                    raised
                    buttonStyle={styles.buttonStyle}
                    containerStyle={styles.buttonContainer}
                    onPress={signIn} />
                </>}
            </KeyboardAvoidingView>
        </View>
    )
}

export default Login

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: yellow
    },
    buttonTitleStyle : { 
        fontWeight: '500', 
        fontSize: 25, 
        color: red 
    },
    signUpButtonTitleStyle: { 
        fontWeight: '500', 
        fontSize: 25, 
        color: white 
    },
    buttonStyle : {
        borderColor: red,
        borderWidth: 2,
        borderRadius: 20,
        // height: 100,
    },
    buttonContainer: {
        width: '85%',
        marginHorizontal: 10,
        marginVertical: 10,
        alignSelf: 'center',
        borderRadius: 20,
    },
    inputContainerStyle: {
        width: '90%', 
        alignSelf: 'center', 
        backgroundColor: 'white', 
        borderRadius: 15, 
        padding: 2,
        paddingLeft: 10
    },
    signUpButtonStyle: {
        borderColor: white,
        backgroundColor: red,
        borderWidth: 2,
        borderRadius: 20,
    }
})