import { View, StyleSheet, Alert } from 'react-native';
import { Stack, useSearchParams, useRouter } from 'expo-router';
import { FIREBASE_AUTH, FIREBASE_DB, FIREBASE_GET_AUTH } from '../../../firebaseConfig';
import { getDatabase, ref, set, onValue, update, remove, push } from "firebase/database";
import {useState, useEffect, useMemo, useLayoutEffect} from "react";
import { Card, Button, Icon, Text, Image, Avatar } from '@rneui/themed';
// import moment from "moment";
import moment from 'moment-timezone';
import * as Crypto from 'expo-crypto';

const stampClass = [ false, false, false, false, false, false, false, false, false, false ];
const red = 'rgba(199, 43, 98, 1)';
const yellow = '#ffc107';
const white = '#fff';

const HomeDetail = () => {
    const router = useRouter();
    const { id } = useSearchParams();
    const [user, setUser] = useState({});

    const db = FIREBASE_DB;
    const getUser = ref(db, 'users/' + id);
    const [stamps, setStamps] = useState(stampClass);

    useLayoutEffect(() => {
      onValue(getUser, (snapshot) => {
        const data = snapshot.val();
        let tempStamps = []
        stamps.forEach((v, i) => {
          if (i < data.stamps) {
            tempStamps.push(true);
          } else {
            tempStamps.push(false);
          }
        })
        setStamps(tempStamps);
        setUser(data);
      }, {
        onlyOnce: true
      });
    }, []);

  

    const onStamp = (value, index) => {
      let tempStamp = [];
      // stamps[index] = !stamps[index];
      stamps.forEach((val) => {
        if (val){
          tempStamp.push(true)
        } else {
          tempStamp.push(false);
        }
      });
      tempStamp[index] = !stamps[index];
      setStamps(tempStamp);
    }

    const showStampAlert = () => {
      let countStamps = stamps.filter((val) => (val ==  true)).length;
      if (user.stamps === undefined) user.stamps = 0;
      let newStamps = countStamps - user.stamps;
      if (newStamps > 0) {
        Alert.alert('Are you sure?', `You want to give ${newStamps} stamps`, [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'destructive',
          },
          {text: 'OK', onPress: () => {
            const stampRef = ref(db, 'users/' + id + '/stamps/');
            set(stampRef, countStamps);
            const transactionRef = ref(db, 'transactions/' + new Date().getTime());
            const today = moment(new Date()).tz("Australia/Melbourne").format('YYYY-MM-DDTHH:mm:ss.SSS');
            // const today = moment(new Date()).tz("Australia/Melbourne").valueOf();
            set(transactionRef, {
              user: user.name, 
              stamps: newStamps, 
              dateTime: today
            })
            router.back();
          }},
        ]);
      } else if (newStamps == 0) {
        Alert.alert('Please stamp first!');
      } else {
        Alert.alert("Please can't deduct stamp!");
      }
    }


    const onFreeDrink = () => {
      //Reset stamps user
      const stampRef = ref(db, 'users/' + id + '/stamps/');
      set(stampRef, 0);
      //Save transaction
      const transactionRef = ref(db, 'transactions/'+new Date().getTime());
      const today = moment(new Date()).tz("Australia/Melbourne").format('YYYY-MM-DDTHH:mm:ss.SSS');
      // const today = moment(new Date()).tz("Australia/Melbourne").valueOf();
      set(transactionRef, {
        user: user.name, 
        stamps: 0, 
        dateTime: today
      })
      router.back();
    }

    const confirmFreeDrink = () => {
      Alert.alert('Are you sure?', 'You want to give a free drink', [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'destructive',
        },
        {text: 'OK', onPress: () => onFreeDrink()},
      ]);
    }
   
    return (
        <View style={styles.mainContainer}>
            <Stack.Screen options={{
              headerTitle: '',
              headerTintColor: red,
              // headerBackButtonMenuEnabled: false,
              // headerBackTitleVisible: false,
              headerTitleStyle: {
                  fontSize: 20
              },
              headerStyle: {
                  backgroundColor: yellow,
              },
            }} />
            <Card containerStyle={styles.cardContainer}>
              <Card.Title style={styles.cardTitle}>{user.name}</Card.Title>
              <View style={styles.container}>
              {stamps.map((value, index) => {
                return (
                  <View style={{width: '20%', marginBottom: 20}}>
                    <Icon
                      reverse={value ? true : false}
                      raised
                      name={value ? 'coffee' : 'coffee-outline'}
                      type='material-community'
                      color={value ? red : yellow}
                      size={25}
                      iconStyle={{borderColor: yellow, borderWidth: 1.5, padding: 13, borderRadius: 25}}
                      onPress={() => onStamp(value, index)}
                    />
                  </View>
                )
              })}
              </View>
            </Card>
            {user.stamps < 10 && <Button
              title="STAMP"
              icon={styles.iconStamp}
              iconLeft
              iconContainerStyle={{ marginRight: 10 }}
              titleStyle={styles.submitButtonTitle}
              type="outline"
              raised
              buttonStyle={styles.submitButton}
              containerStyle={styles.buttonContainer}
              onPress={showStampAlert}
            />}
            {user.stamps == 10 && <Button
              title="GIVE FREE DRINK"
              iconContainerStyle={{ marginRight: 10 }}
              titleStyle={styles.buttonFreeDrinkTitle}
              type="outline"
              raised
              buttonStyle={styles.buttonFreeDrink}
              containerStyle={styles.buttonFreeDrinkContainer}
              onPress={confirmFreeDrink}
            />}
        </View>
    )
}


export default HomeDetail;



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
  mainContainer: {
    backgroundColor: yellow,
    height: '100%'
  },
  container: {
    flexDirection: 'row',
    width: '100%',
    flexWrap: 'wrap',
    marginTop: 10,
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
    height: 100,
  },
  buttonContainer: {
    width: '92%',
    marginHorizontal: 10,
    marginVertical: 20,
    alignSelf: 'center',
    borderRadius: 20,
  },
  buttonFreeDrinkContainer: {
    width: '92%',
    marginHorizontal: 10,
    alignSelf: 'center',
    borderRadius: 20,
    marginTop: 10
  },
  iconStamp: {
    name: 'stamp',
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

