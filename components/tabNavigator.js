import { View, Text } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import HomeScreen from '../screens/homeScreen/homeScreen';
import Account from '../screens/Account/account';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator initialRouteName='HomeScreen'>
      <Tab.Screen name="HomeScreen" component={HomeScreen} />
      <Tab.Screen name="Account" component={Account} />
    </Tab.Navigator>
  )
}

export default TabNavigator