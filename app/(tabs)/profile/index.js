import { View, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Link, useRouter } from 'expo-router'
import { FIREBASE_AUTH, FIREBASE_DB } from '../../../firebaseConfig'
import { Card, Button, Icon, Text, Image, Avatar } from '@rneui/themed';
import { getAuth } from 'firebase/auth';
import { getDatabase, ref, limitToLast, set, onValue, get, update, remove, query,orderByValue, orderByChild } from "firebase/database";
import { ListItem } from '@rneui/themed';

const red = 'rgba(199, 43, 98, 1)';
const yellow = '#ffc107';
const white = '#fff';

const db = FIREBASE_DB;

const ProfilePage = () => {
  const router = useRouter();
  const currentUser = getAuth().currentUser;
  const userRef = ref(db, 'users/' + currentUser.uid);
  const [user, setUser] = useState({});

  const onLogout = () => {
    try{
      FIREBASE_AUTH.signOut();
      router.replace("/screens/Login");
    } catch(error){
      Alert.alert("error signout");
    }
  }

  useEffect(async () => {
    onValue(userRef, (snapshot) => {
      const data = snapshot.val();
      setUser(data);
    }, {
      onlyOnce: true
    });
  }, [])

  return (
    <View style={styles.container}>
      <View style={styles.subContainer}>
        <Icon
        name='user'
        type='font-awesome'
        onPress={() => console.log('hello')} />
        <Text h4>{user?.name ? user.name : 'Customer'}</Text>
      </View>
      <View style={styles.subContainer}>
        <Icon
        name='inbox'
        type='font-awesome'
        onPress={() => console.log('hello')} />
        <Text h4>{currentUser.email}</Text>
      </View>
      <View style={styles.subContainer}>
        <Icon
          name='link'
          type='font-awesome'
          onPress={() => console.log('hello')} />
        <Text h4><Link href={"/profile/termsconditions"}>Terms & Conditions</Link></Text>
      </View>
        <View style={styles.subContainer}>
        <Icon
          name='link'
          type='font-awesome'
          onPress={() => console.log('hello')} />
        <Text h4><Link href={"/profile/privacy"}>Privacy Policy</Link></Text>
      </View>

      {/* <View style={{ padding: 10, flexDirection: 'row', flexWrap: 'wrap', width: '70%', justifyContent: 'space-between' }}>
        <Text h4>Name</Text>
        <Text h4>{user?.name ? user.name : 'Customer'}</Text>
      </View>
      <View style={{ padding: 10, flexDirection: 'row', flexWrap: 'wrap', width: '70%', justifyContent: 'space-between' }}>
        <Text h4>Email</Text>
        <Text h4>{currentUser.email}</Text>
      </View>
      <View style={{ padding: 10, flexDirection: 'row', flexWrap: 'wrap', width: '70%', justifyContent: 'space-between' }}>
        <Link href={"/profile/termsconditions"}>Terms & Conditions</Link>
      </View>
      <View style={{ padding: 10, flexDirection: 'row', flexWrap: 'wrap', width: '70%', justifyContent: 'space-between' }}>
        <Link href={"/profile/privacy"}>Privacy Policy</Link>
      </View> */}
      <Button
        title="LOGOUT"
        titleStyle={styles.submitButtonTitle}
        type="outline"
        raised
        buttonStyle={styles.submitButton}
        containerStyle={styles.buttonContainer}
        onPress={onLogout} />
    </View>
  )
}

export default ProfilePage


const styles = StyleSheet.create({
  cardContainer: { 
    marginTop: 15, 
    borderRadius: 20,
    borderWidth: 2,
    borderColor: red,
    // backgroundColor: yellow
  },
  cardTitle: {
    backgroundColor: 'white', 
    // borderWidth: 1, 
    borderColor: red, 
    padding:7, 
    fontSize: 20, 
    fontStyle: 'italic',
    color: red
  },
  subContainer: { 
    padding: 10, 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    width: '70%', 
    justifyContent: 'space-between' 
  },
  mainContainer: {
    backgroundColor: yellow,
    height: '100%'
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: yellow,
    height: '100%'
  },
  miniIconStamp: {
    color: red, 
    borderWidth: 2, 
    padding: 13.5, 
    borderRadius: 26,
    borderColor: red
  },
  submitButtonTitle : { 
    fontWeight: '500', 
    fontSize: 25, 
    color: red },
  submitButton : {
    // backgroundColor: yellow,
    // borderColor: 'transparent',
    borderColor: red,
    borderWidth: 2,
    borderRadius: 20,
    height: 50,
  },
  buttonContainer: {
    width: '92%',
    marginHorizontal: 10,
    marginVertical: 20,
    alignSelf: 'center',
    borderRadius: 20,
    position: 'absolute',
    bottom: 10
  },
  buttonFreeDrinkContainer: {
    width: '92%',
    marginHorizontal: 10,
    alignSelf: 'center',
    borderRadius: 20,
    marginTop: 10
  },
  iconStamp: {
    name: 'exit',
    type: 'font-awesome-5',
    size: 25,
    color: red,
  },
  iconFreeDrink: {
    name: 'stamp',
    type: 'font-awesome-5',
    size: 25,
    color: yellow,
  },
  buttonFreeDrink: {
    // backgroundColor: yellow,
    borderColor: red,
    borderWidth: 2,
    borderRadius: 20,
    height: 100,
  },
  buttonFreeDrinkTitle: {
    fontWeight: '500', 
    fontSize: 25, 
    color: red,
    textDecorationLine: 'underline'
  },
})