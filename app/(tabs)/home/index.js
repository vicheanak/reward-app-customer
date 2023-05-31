import { View, Button, StyleSheet, FlatList, Alert } from 'react-native'
import React from 'react'
import { Link, useRouter } from 'expo-router'

import { FIREBASE_AUTH, FIREBASE_DB, FIREBASE_GET_AUTH } from '../../../firebaseConfig';
import { getDatabase, ref, limitToLast, set, onValue, get, update, remove, query,orderByValue, orderByChild } from "firebase/database";
import {useState, useEffect, useMemo} from "react";
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Chip, Divider, withTheme, lightColors, Card, Text, ListItem } from '@rneui/themed';
import { ScrollView } from 'react-native-gesture-handler';
import moment from 'moment-timezone';
import { useIsFocused } from "@react-navigation/native";

const red = 'rgba(199, 43, 98, 1)';
const yellow = '#ffc107';
const white = '#fff';
moment.tz.setDefault("Australia/Melbourne");

const HomePage = () => {
  const isFocused = useIsFocused();
  const db = FIREBASE_DB;
  const [list, setList] = useState([])
  const usersRef = ref(db, 'users/');
  // const transactionsRef = ref(db, 'transactions/');
  const transactionsRef = query(ref(db, 'transactions'), orderByChild('dateTime'), limitToLast(10));

  const router = useRouter();

  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [transactions, setTransactions] = useState([])
  const getInitialData = async () => {
    console.log('Focused');
  }    

  //Barcode Scanner
  const getBarCodeScannerPermissions = async () => {
    const { status } = await BarCodeScanner.requestPermissionsAsync();
    setHasPermission(status === 'granted');
  };

  useEffect(() => {
    // if(isFocused){ 
    //   getInitialData();
    // }
    
    onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      setList(data);
    }, {
      onlyOnce: true
    });

    get(transactionsRef).then(snapshot => {
      // console.log('=====> ', snapshot.val());
      const data = snapshot.val();
      // console.log({data});
      if (data) {
        const sortedArray = Object.entries(data).sort((a, b) => {
          const timeA = new Date(a[1].dateTime);
          const timeB = new Date(b[1].dateTime);
          return timeB - timeA;
        });
        
        // Convert the sorted array back to an object
        const sortedObject = Object.fromEntries(sortedArray);
        
        setTransactions(sortedObject);
      } else {
        setTransactions(data);
      }
    })
    

    getBarCodeScannerPermissions();

    setScanned(false);
    console.log('Back Now!')

  }, [isFocused]);
  
  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    // alert(`Bar code with type ${type} and data ${data} has been scanned!`);
    if (isFinite(data)){
      get(ref(db, `users/${data}`)).then(snapshot => {
        let isUser = snapshot.val();
        console.log({isUser})
        if (isUser){
          router.push("/home/"+data);
        } else {
          Alert.alert("Customer Not Found", "", [
            {text: 'OK', onPress: () => setScanned(false)},
          ]);
        }
      }).catch(() => {
        console.log('Error get user');
      })
    } else {
      Alert.alert("QR Code is invalid", "", [
        {text: 'OK', onPress: () => setScanned(false)},
      ]);
    }
    
    // router.push("/home/"+1685083999703);
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }

  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const incrementByOne = () => {
    
    const d1 = new Date();
    const usersRef = ref(db, 'users/' + d1.getTime());
    
    // set(userRef, {
    //   'email': 'terry@gmail.com',
    //   'name': 'Terry',
    //   'stamps': 0
    // });

    onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      console.log({data})
      setList(data);
    }, {
      onlyOnce: true
    });

    // remove(ref(db, 'users'));
  }
  
  const Item = ({title}) => (
    <View containerStyle={styles.itemContainer}>
      <Text style={styles.itemText}>Jim got 2 stamps</Text>
      <Text style={styles.itemDate}>1:03pm</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.viewBarcodeContainer}>
        {scanned && <Button style={styles.scannedButton} title={'Tap to Scan Again'} onPress={() => setScanned(false)} />}
        {/* <Button style={styles.scannedButton} title={'Tap to Scan Again'} onPress={() => setScanned(false)} /> */}
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={styles.barcodeContainer}
        />
      </View>
      <View style={{marginTop: 10, width: '90%', alignSelf: 'center'}}>
        <Text style={styles.transactionTitle}>Latest transactions</Text>
        <ScrollView style={styles.scrollView}>
        {transactions && Object.entries(transactions).map(([key, val], i) => (
          <View>
            <ListItem>
              <ListItem.Content>
                {val.stamps == 0 ? <ListItem.Title style={{color: red}}>{val.user} got a free drink!</ListItem.Title> : <ListItem.Title>{val.user} got {val.stamps} {val.stamps < 2 ? 'stamp' : 'stamps'}</ListItem.Title> }
              </ListItem.Content>
              <ListItem.Subtitle>{moment(val.dateTime).fromNow()}</ListItem.Subtitle>
              {/* <ListItem.Subtitle>{moment(val.dateTime).format('YYYY-MM-DDTHH:mm:ss.SSS')}</ListItem.Subtitle> */}
            </ListItem>
            <Divider />
          </View>
        ))}
          {/* {transactions.map(val => {
            return (
              <ListItem>
                <ListItem.Content>
                  <ListItem.Title>{val.user} got {val.stamps} {val.stamps < 2 ? 'stamp' : 'stamps'}</ListItem.Title>
                </ListItem.Content>
                <ListItem.Subtitle>{val.time}</ListItem.Subtitle>
              </ListItem>
            )
          })} */}
          
        </ScrollView>
      </View>
      {list && Object.entries(list).map(([key, val], i) => (
        <Link href={"/home/"+key}>{val.name}</Link>
      ))}
      <Button onPress={ () => {
        incrementByOne();
      }} title="Increment"></Button>
      
    </View>
  )
}

export default HomePage

const styles = StyleSheet.create({
  scrollView: {
    height: '40%', 
    marginTop: 10, 
    width: '100%', 
    alignSelf: 'center', 
    borderRadius: 10, 
    padding: 10, 
    backgroundColor: 'white'
},
scannedButton: {
  position: 'absolute',
  top:100,
  color: red
},
  container: {
    alignItems: 'center',
    backgroundColor: yellow,
    height: '100%'
  },
  transactionTitle: {
    marginLeft: 5,
    fontSize: 20,
    // textAlign: 'center',
    // fontStyle: 'italic',
    // color: red
  },
  barcodeContainer: {
      borderRadius: 20,
      // marginTop: 20,
      height: '100%',
      width: '100%'
  },
  viewBarcodeContainer: {
    borderRadius: 20,
    // marginTop: 20,
    height: 300,
    width: '90%'
  },
  input: {
      marginVertical: 4,
      height: 50,
      borderWidth: 1,
      borderRadius: 4,
      padding: 10,
      backgroundColor: '#fff'
  },
  itemCard: {
    width: '92%',
    marginVertical: -10
  },
  itemContainer: {
    flex: 1,
    flexDirection: "row", /*it was column*/ 
    alignContent: "space-between",
  },
  itemDate: {
    // minWidth: 5,
    // maxWidth: 80,
    // marginLeft: 5,
    // backgroundColor: 'red'
  },
  itemText: {
    // backgroundColor: 'red',
    // minWidth: 5,
    // maxWidth: 220,
    // height: 25,
    // fontSize: 17,
    // borderBottomWidth: 1,
    // borderBottomColor: 'red',
    // borderColor: 'red'
  }
})