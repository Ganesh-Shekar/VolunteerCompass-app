import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './login';
// import Signup from './Signup';
import Signup from './signup2';


const Stack = createNativeStackNavigator();

function LoginSignUp() {
  return (
    <Stack.Navigator initialRouteName='Login' screenOptions={{headerShown: false}}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Sign Up" component={Signup} />
    </Stack.Navigator>
  );
}

export default LoginSignUp;