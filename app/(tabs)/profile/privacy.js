import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { ScrollView } from 'react-native-gesture-handler'

const red = 'rgba(199, 43, 98, 1)';
const yellow = '#ffc107';
const white = '#fff';

const privacy = () => {
  return (
    <ScrollView style={{ paddingHorizontal: 20,  backgroundColor: yellow }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Privacy Policy</Text>
        <Text style={{ marginBottom: 10 }}>
            Welcome to the Reward App! This privacy policy outlines how we collect, use, and protect your personal information when you use our mobile application.
        </Text>
        <Text style={{ marginBottom: 10 }}>
            1. Information Collection: We may collect personal information such as your name, email address, and other relevant details when you register an account or interact with our app.
        </Text>
        <Text style={{ marginBottom: 10 }}>
            2. Information Usage: We use the collected information to provide and improve our services, personalize your experience, and communicate with you about promotions or updates.
        </Text>
        <Text style={{ marginBottom: 10 }}>
            3. Information Sharing: We do not sell, trade, or rent your personal information to third parties. However, we may share certain information with trusted partners to assist us in operating our app.
        </Text>
        <Text style={{ marginBottom: 10 }}>
            4. Data Security: We implement appropriate security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction.
        </Text>
        <Text style={{ marginBottom: 10 }}>
            5. Analytics and Cookies: We may use analytics tools and cookies to collect information about how you interact with our app, improve our services, and provide personalized content.
        </Text>
        <Text style={{ marginBottom: 10 }}>
            6. Third-Party Links: Our app may contain links to third-party websites or services. We are not responsible for the privacy practices or content of those websites.
        </Text>
        <Text style={{ marginBottom: 10 }}>
            7. Children's Privacy: Our app is not intended for use by children under the age of 13. We do not knowingly collect personal information from children.
        </Text>
        <Text style={{ marginBottom: 10 }}>
            8. Updates to Privacy Policy: We reserve the right to update or modify this privacy policy at any time. Any changes will be effective upon posting the revised policy within the app.
        </Text>
        <Text style={{ marginBottom: 10 }}>
            If you have any questions or concerns regarding our privacy policy, please contact our support team.
        </Text>
    </ScrollView>
  )
}

export default privacy

const styles = StyleSheet.create({})