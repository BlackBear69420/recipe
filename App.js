import React from 'react';
import { StatusBar } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import Toast from 'react-native-toast-message';

const App = () => {
  return (
   <>
    <StatusBar backgroundColor="#e6e6fa" barStyle="dark-content" />
    <Toast />
      <AppNavigator />
   </>
     
  );
};

export default App;
