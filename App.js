import React, { useState, useEffect, useLayoutEffect }  from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import AppLoading from 'expo-app-loading';
import AsyncStorage from '@react-native-async-storage/async-storage';

import LoginSignUp from './screens/logIn/LoginSignUp';
import HomeScreen from './screens/homeScreen/homeScreen';
import AboutUs from './screens/aboutUs/aboutUs';
import Account from './screens/Account/account';
import NgoScreen from './screens/ngoScreen/ngoScreen';
import MyEvents from './screens/myEvents/myEvents';
import BlogPage from './screens/BlogPage/blogPage';
import NgoHomeScreen from './screens/ngoScreen/NgoHomeScreen';
import Login from './screens/logIn/login';
// import Signup from './Signup';
import Signup from './screens/logIn/signup2';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();



const LoginNav = () => {
  return (
    <Stack.Navigator initialRouteName='Login' screenOptions={{headerShown: false}}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Sign Up" component={Signup} />
      <Stack.Screen name="HomeScreen" component={TabNav} />
    </Stack.Navigator>
  );
}

const TabNav = () => {
  return (
    <Tab.Navigator screenOptions={{headerShown:false}}>
      <Tab.Screen name="Home" component ={HomeNavigator} />
      <Tab.Screen name="My Events" component={MyEvents} />
      <Tab.Screen name="Blogs" component={BlogPage} />
    </Tab.Navigator>
  )
}

const HomeNavigator = ({ navigation, route }) => {
  useLayoutEffect(() => {
    const routeName = getFocusedRouteNameFromRoute(route)
    if (routeName === "LoginUser") {
      navigation.setOptions({tabBarStyle: {display:'none'}})
    } else {
      navigation.setOptions({tabBarStyle: {display: 'flex'}})
    }
  }, [navigation, route])
  return (
    <Stack.Navigator initialRouteName='HomeScreen' screenOptions={{headerShown: false}}>
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="NgoHomeScreen" component={NgoHomeScreen} />
        <Stack.Screen name="Account" component={Account} />
        <Stack.Screen name="NgoPage" component={NgoScreen} />
        <Stack.Screen name="LoginUser" component={LoginNav} />
    </Stack.Navigator>
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  async function getData() {
    const data = await AsyncStorage.getItem('isLoggedIn')
    setIsLoggedIn(data)
  }

  useEffect(() => {
    getData()
    // setTimeout(() => {
    //   SplashScreen.hide()
    // }, 900)
  }, [])


  return (
    <NavigationContainer>
      {/* {isLoggedIn ? <TabNav /> : <LoginNav />} */}
      <TabNav />
    </NavigationContainer>
  );
}

export default App;