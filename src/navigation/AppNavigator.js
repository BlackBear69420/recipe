
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import Home from '../screens/Home'
import RecipeDetails from '../screens/RecipeDetails'
import Search from '../screens/Search'
const Stack=createStackNavigator()
const AppNavigator = () => {
  return (
   <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen options={{headerShown:false}} name='Home' component={Home}/>
      <Stack.Screen options={{headerShown:false}} name='RecipeDetails' component={RecipeDetails}/>
      <Stack.Screen options={{headerShown:false}} name='Search' component={Search}/>
    </Stack.Navigator>
   </NavigationContainer>
  )
}

export default AppNavigator