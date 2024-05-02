import { useNavigation } from '@react-navigation/core'
import React, { useEffect, useState } from 'react'
import { KeyboardAvoidingView, StyleSheet, Text,TouchableOpacity, View } from 'react-native'
import {auth,firestore} from '../../firebase'
import { TextInput } from 'react-native-paper'
import AsyncStorage from '@react-native-async-storage/async-storage'

const Signup = () => {
  const [email1, setEmail1] = useState('')
  const [password, setPassword] = useState('')

  const navigation = useNavigation()

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
       
        navigation.replace("Home")
      }
    })

    return unsubscribe
  }, [])
  const handleSignUp = () => {
    auth
      .createUserWithEmailAndPassword(email1, password)
      .then(userCredentials => {
        const user = userCredentials.user;
        console.log('Registered with:', user.email);
  
        // Extract the email prefix
        const emailParts = user.email.split('@');
        const emailPrefix = emailParts[0];
  
        // Set the user email as 'user' in AsyncStorage
        AsyncStorage.setItem('user', user.email);
  
        // Add the email prefix as a document in the 'liked' collection
        return firestore.collection('liked').doc(emailPrefix).set({ likedId: '' });
      })
      .catch(error => alert(error.message));
  }
  


  return (
    <KeyboardAvoidingView
      style={styles.container}
    >
   <View
      style={{
        width: '90%',
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#4169e1',
        paddingVertical: 30,
        borderRadius: 10,
        ...Platform.select({
          ios: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
          },
          android: {
            elevation: 5,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
          },
        }),
      }}>
<View style={styles.inputContainer}>
        <TextInput
          label="Email"
          value={email1}
          onChangeText={text => setEmail1(text)}
          style={styles.input}
        />
        <TextInput
          label="Password"
          value={password}
          onChangeText={text => setPassword(text)}
          style={styles.input}
          secureTextEntry
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={handleSignUp}
          style={[styles.button, styles.buttonOutline]}
        >
          <Text style={styles.buttonOutlineText}>Register</Text>
        </TouchableOpacity>
      </View>
</View>
    </KeyboardAvoidingView>
  )
}

export default Signup

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f8f4ff',
    },
    inputContainer: {
      width: '80%',
      gap:30
    },
    input: {
      backgroundColor: 'white',
      fontSize:16
    },
    buttonContainer: {
      width: '60%',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 40,
    },
    button: {
      backgroundColor: '#1338be',
      width: '100%',
      padding: 8,
      borderRadius: 10,
      alignItems: 'center',
    },
    buttonOutline: {
      marginTop: 5,
      borderColor: 'white',
      borderWidth: 2,
    },
    buttonText: {
      color: 'white',
      fontWeight: '700',
      fontSize: 20,
    },
    buttonOutlineText: {
      color: 'white',
      fontWeight: '700',
      fontSize: 20,
    },
  })