import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, Platform } from 'react-native';
import { auth } from '../../firebase';
import { TextInput } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const Login = () => {
  const [email1, setEmail1] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async user => {
      setLoading(false); // Set loading to false when the authentication check is complete
      if (user) {
        navigation.replace('Home');
      } else {
        try {
          const storedUser = await AsyncStorage.getItem('user');
          if (storedUser) {
            navigation.replace('Home');
          }
        } catch (error) {
          console.error('Error reading user from AsyncStorage:', error);
        }
      }
    });

    return unsubscribe;
  }, []);

  const handleLogin = () => {
    setLoading(true); // Set loading to true when login is initiated
    auth.signInWithEmailAndPassword(email1, password)
      .then(userCredentials => {
        const user = userCredentials.user;
        
  
        // Extract email prefix
        const emailParts = user.email.split('@');
        const emailPrefix = emailParts[0];
        console.log('Logged in with:',emailPrefix);
  
        // Store email prefix in AsyncStorage
        AsyncStorage.setItem('user', emailPrefix);
      })
      .catch(error => {
        alert(error.message);
        setLoading(false); // Set loading to false when login fails
      });
  };
  
  return (
    <KeyboardAvoidingView style={styles.container}>
      {loading ? ( // Show activity indicator while loading is true
        <ActivityIndicator size="large" color="white" />
      ) : ( // Show login components when loading is false
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
              onPress={handleLogin}
              style={[styles.button, styles.buttonOutline]}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ flexDirection: 'row', paddingTop: 10 }}
              onPress={() => navigation.navigate('Signup')}>
              <Text style={{ fontSize: 17, color: 'white' }}>Not a user? </Text>
              <Text style={{ fontSize: 18, color: 'white', fontWeight: 700 }}>
                Click here
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

export default Login;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f8f4ff',
    },
    inputContainer: {
      width: '80%',
      gap: 30,
    },
    input: {
      backgroundColor: 'white',
      fontSize: 15,
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
      padding: 10,
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
      fontSize: 18,
    },
    buttonOutlineText: {
      color: '#0782F9',
      fontWeight: '700',
      fontSize: 16,
    },
  });