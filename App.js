import React, { useState, useEffect, useLayoutEffect } from "react";
import { Dimensions } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { navigationRef } from "./NavigationService";
import HomeScreen from "./screens/homeScreen/homeScreen";
import Account from "./screens/Account/account";
import NgoScreen from "./screens/ngoScreen/ngoScreen";
import MyEvents from "./screens/myEvents/myEvents";
import BlogPage from "./screens/BlogPage/blogPage";
import NgoHomeScreen from "./screens/ngoScreen/NgoHomeScreen";
import Login from "./screens/logIn/login";
// import Signup from './Signup';
import Signup from "./screens/logIn/signup2";
import Icon from "react-native-vector-icons/FontAwesome";
import { RFValue } from "react-native-responsive-fontsize";
import CreateEditEvent from "./screens/myEvents/CreateEditEvent";
const { width } = Dimensions.get("window");

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const LoginNav = () => {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Sign Up" component={Signup} />
      <Stack.Screen name="HomeScreen" component={TabNav} />
    </Stack.Navigator>
  );
};

const TabNav = () => {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false, tabBarShowLabel: false }}
    >
      <Tab.Screen
        name="Home"
        component={HomeNavigator}
        options={{
          tabBarIcon: ({ focused }) => (
            <Icon
              name="home"
              color={focused ? "#20a963" : "gray"}
              size={width < 450 ? RFValue(22) : RFValue(15.5)}
              style={{ marginTop: RFValue(10) }}
            />
          ),
        }}
      />

      <Tab.Screen
        name="My Events"
        component={EventsScreen}
        options={{
          tabBarIcon: ({ focused, size }) => (
            <Icon
              name="handshake-o"
              color={focused ? "#20a963" : "gray"}
              size={width < 450 ? RFValue(20) : RFValue(10)}
              style={{ marginTop: RFValue(10) }}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Blogs"
        component={BlogPage}
        options={{
          tabBarIcon: ({ focused, size }) => (
            <Icon
              name="pencil-square-o"
              color={focused ? "#20a963" : "gray"}
              size={width < 450 ? RFValue(20) : RFValue(14)}
              style={{ marginTop: RFValue(10) }}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

function EventsScreen() {
  return (
    <Stack.Navigator
      initialRouteName="MyEvents"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="MyEvents" component={MyEvents} />
      <Stack.Screen name="CreateEditEvent" component={CreateEditEvent} />
    </Stack.Navigator>
  );
}

const HomeNavigator = ({ navigation, route }) => {
  useLayoutEffect(() => {
    const routeName = getFocusedRouteNameFromRoute(route);
    if (routeName === "LoginUser") {
      navigation.setOptions({ tabBarStyle: { display: "none" } });
    } else {
      navigation.setOptions({ tabBarStyle: { display: "flex" } });
    }
  }, [navigation, route]);
  return (
    <Stack.Navigator
      initialRouteName="HomeScreen"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="NgoHomeScreen" component={NgoHomeScreen} />
      <Stack.Screen name="Account" component={Account} />
      <Stack.Screen name="NgoPage" component={NgoScreen} />
      <Stack.Screen name="MyEvents" component={EventsScreen} />
      <Stack.Screen name="LoginUser" component={LoginNav} />
    </Stack.Navigator>
  );
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  async function getData() {
    const data = await AsyncStorage.getItem("isLoggedIn");
    setIsLoggedIn(data === "true");
  }

  useEffect(() => {
    getData();
    // setTimeout(() => {
    //   SplashScreen.hide()
    // }, 900)
  }, []);

  return (
    <NavigationContainer ref={navigationRef}>
      {isLoggedIn ? <TabNav /> : <LoginNav />}
      {/*<TabNav />*/}
    </NavigationContainer>
  );
}

export default App;
