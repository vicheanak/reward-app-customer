import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { ScrollView } from 'react-native-gesture-handler'

const red = 'rgba(199, 43, 98, 1)';
const yellow = '#ffc107';
const white = '#fff';

const termsconditions = () => {
  return (
    <ScrollView style={{ paddingHorizontal: 20,  backgroundColor: yellow }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Terms and Conditions</Text>
        <Text style={{ marginBottom: 10 }}>
            Welcome to the Reward App! These terms and conditions outline the rules and regulations for the use of our mobile application.
        </Text>
        <Text style={{ marginBottom: 10 }}>
            By accessing or using the Reward App, you agree to be bound by these terms and conditions. If you disagree with any part of these terms and conditions, please do not use our app.
        </Text>
        <Text style={{ marginBottom: 10 }}>
            1. Eligibility: You must be at least 13 years old and comply with all applicable laws to use the Reward App.
        </Text>
        <Text style={{ marginBottom: 10 }}>
            2. Account Registration: You must provide accurate and complete information during the registration process. You are solely responsible for maintaining the confidentiality of your account credentials.
        </Text>
        <Text style={{ marginBottom: 10 }}>
            3. Earning Rewards: You can earn rewards by participating in eligible activities as specified in the app. Rewards may be subject to expiration or other limitations.
        </Text>
        <Text style={{ marginBottom: 10 }}>
            4. Redeeming Rewards: You can redeem your earned rewards as per the terms and conditions set by the Reward App. The availability of rewards and redemption options may vary.
        </Text>
        <Text style={{ marginBottom: 10 }}>
            5. Prohibited Conduct: You agree not to engage in any illegal, abusive, or unauthorized use of the app. Any violation may result in the termination of your account.
        </Text>
        <Text style={{ marginBottom: 10 }}>
            6. Modification of Terms: The Reward App reserves the right to modify or update these terms and conditions at any time. It is your responsibility to review the terms periodically.
        </Text>
        <Text style={{ marginBottom: 10 }}>
            7. Limitation of Liability: The Reward App shall not be liable for any direct, indirect, incidental, or consequential damages arising out of or in connection with the use of our app.
        </Text>
        <Text style={{ marginBottom: 10 }}>
            8. Governing Law: These terms and conditions are governed by and construed in accordance with the laws of your jurisdiction.
        </Text>
        <Text style={{ marginBottom: 10 }}>
            If you have any questions or concerns regarding these terms and conditions, please contact our support team.
        </Text>
    </ScrollView>
  )
}

export default termsconditions

const styles = StyleSheet.create({})