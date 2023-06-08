import { View, StyleSheet, FlatList, Alert, useLayoutEffect, Dimensions } from 'react-native'
import React from 'react'
import { Link, useRouter } from 'expo-router'

import { FIREBASE_AUTH, FIREBASE_DB, FIREBASE_GET_AUTH } from '../../../firebaseConfig';
import { getDatabase, ref, limitToLast, set, onValue, get, update, remove, query,orderByValue, orderByChild } from "firebase/database";
import { getAuth } from 'firebase/auth';
import {useState, useEffect, useMemo} from "react";
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Chip, Divider, withTheme, lightColors, Card, Text, ListItem, Button, Icon } from '@rneui/themed';
import { ScrollView } from 'react-native-gesture-handler';
import moment from 'moment-timezone';
import { useIsFocused } from "@react-navigation/native";
import QRCode from 'react-native-qrcode-svg';

const red = 'rgba(199, 43, 98, 1)';
const yellow = '#ffc107';
const white = '#fff';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
moment.tz.setDefault("Australia/Melbourne");

const HomePage = () => {
  const isFocused = useIsFocused();
  const db = FIREBASE_DB;
  const [list, setList] = useState([])
  const usersRef = ref(db, 'users/');
  // const transactionsRef = ref(db, 'transactions/');
  const transactionsRef = query(ref(db, 'transactions'), orderByChild('dateTime'), limitToLast(10));
  const auth = getAuth();
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

 

  const [user, setUser] = useState({});
  const [stamps, setStamps] = useState([ false, false, false, false, false, false, false, false, false, false ]);
  const [userAuth, setUserAuth] = useState({});
  useEffect(() => {
    // if(isFocused){ 
    //   getInitialData();
    // }

    setUserAuth(auth.currentUser)
    const getUser = ref(db, 'users/' + auth.currentUser.uid);

    console.log({stamps});
    onValue(getUser, (snapshot) => {
      const data = snapshot.val();
      let tempStamps = []
      console.log({data});
      stamps.forEach((v, i) => {
        if (i < data.stamps) {
          tempStamps.push(true);
        } else {
          tempStamps.push(false);
        }
      })
      setStamps(tempStamps);
      setUser(data);
    });
    
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

  
  const Item = ({title}) => (
    <View containerStyle={styles.itemContainer}>
      <Text style={styles.itemText}>Jim got 2 stamps</Text>
      <Text style={styles.itemDate}>1:03pm</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.viewBarcodeContainer}>
        <Card containerStyle={styles.cardContainer}>
          <Card.Title style={styles.cardTitle}>{user.name}</Card.Title>
          <Card.Divider />
          <View style={styles.insideCardContainer}>
          {stamps.map((value, index) => {
            return (
              <View key={index} style={{width: '20%', marginBottom: 20}}>
                <Icon
                  reverse={value ? true : false}
                  raised
                  name={value ? 'coffee' : 'coffee-outline'}
                  type='material-community'
                  color={value ? red : yellow}
                  size={25}
                  iconStyle={{borderColor: yellow, borderWidth: 1.5, padding: 13, borderRadius: 25}}
                  // onPress={() => onStamp(value, index)}
                />
              </View>
            )
          })}
          </View>
        </Card>
      </View>
      <View style={styles.bottomContainer}>
        {/* <Text style={styles.transactionTitle}>Latest transactions</Text> */}
        <View style={styles.scrollView}>
          <QRCode
            // color={red}
            // enableLinearGradient={true}
            // linearGradient={['rgb(255,0,0)','rgb(0,255,255)']}
            size={windowWidth - 100}
            value={auth.currentUser.uid}
          />
        </View>
      </View>
      {/* {list && Object.entries(list).map(([key, val], i) => (
        <Link href={"/home/"+key}>{val.name}</Link>
      ))} */}
    </View>
  )
}

export default HomePage

const styles = StyleSheet.create({
  scrollView: {
    // height: '40%', 
    marginTop: 10, 
    width: windowWidth - 60, 
    alignSelf: 'center', 
    borderRadius: 10, 
    padding: 20, 
    backgroundColor: 'white'
},
qrCodeComponent: {
  // width: '100%'
  alignSelf: 'center', 
},
bottomContainer: {
  marginTop: 10, 
  width: '90%', 
  alignSelf: 'center'
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
    width: '100%'
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
  cardContainer: { 
    marginTop: 15, 
    borderRadius: 20,
    borderWidth: 2,
    borderColor: red,
    // backgroundColor: yellow
  },
  cardTitle: {
    backgroundColor: 'white', 
    // borderBottomWidth: 2, 
    // borderBottomColor: red,
    // borderWidth: 2,
    // padding:7, 
    fontSize: 20, 
    fontStyle: 'italic',
    color: red
  },
  mainContainer: {
    backgroundColor: yellow,
    height: '100%'
  },
  insideCardContainer: {
    flexDirection: 'row',
    width: '100%',
    flexWrap: 'wrap',
    marginTop: 10,
  },
})