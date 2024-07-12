import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ImageBackground,
  Dimensions,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { useNavigation } from "@react-navigation/native";
import { RegisterLogin, signIn } from "../../backend/getApiRequests";
import { Form, Formik } from "formik";
import * as yup from "yup";
import { RFValue } from "react-native-responsive-fontsize";
import AsyncStorage from "@react-native-async-storage/async-storage";
import logo from "../../assets/App_logo.png";
import white_bg from "../../assets/white_background.jpg";
const logo1 = Image.resolveAssetSource(logo).uri;
const white_bg1 = Image.resolveAssetSource(white_bg).uri;
const { width, height } = Dimensions.get("window");

const ReviewSchema = yup.object({
  email: yup
    .string()
    .email("Please enter valid email address")
    .required("*Required"),
  password: yup
    .string()
    .required("*Required")
    .min(6, "Password must be at least 6 characters long"),
});

const Login = () => {
  const navigation = useNavigation();

  const handleLogin = async (userInfo) => {
    try {
      const response = await signIn(userInfo);
      if (
        response != null &&
        response != undefined &&
        response.statusCode === 200
      ) {
        if (response.data["type"] === "user") {
          await AsyncStorage.setItem("token", response.data["user_id"]);
          await AsyncStorage.setItem("first_name", response.data["first_name"]);
          await AsyncStorage.setItem("last_name", response.data["last_name"]);
          await AsyncStorage.setItem("email", response.data["contact_email"]);
          await AsyncStorage.setItem(
            "phone",
            JSON.stringify(response.data["phone"])
          );
          await AsyncStorage.setItem("type", response.data["type"]);
          await AsyncStorage.setItem("isLoggedIn", JSON.stringify(true));
          navigation.replace("HomeScreen");
        } else if (response.data["type"] === "ngo") {
          await AsyncStorage.setItem("token", response.data["ngo_id"]);
          await AsyncStorage.setItem(
            "first_name",
            response.data["ngo_display_name"]
          );
          await AsyncStorage.removeItem("last_name");
          await AsyncStorage.setItem("email", response.data["contact_email"]);
          await AsyncStorage.setItem(
            "phone",
            JSON.stringify(response.data["contact_phone"])
          );
          await AsyncStorage.setItem("type", response.data["type"]);
          await AsyncStorage.setItem("isLoggedIn", JSON.stringify(true));
          navigation.replace("HomeScreen");
        }
      } else if (response.statusCode === 101 || response.statusCode === 102) {
        Alert.alert(response.message);
      }
    } catch (err) {
      console.log(JSON.stringify(err));
      Alert.alert(err.message);
    }
  };

  return (
    <ImageBackground
      source={{ uri: white_bg1 }}
      resizemode="cover"
      style={styles.image}
    >
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={ReviewSchema}
        onSubmit={(values) => {
          handleLogin(values);
        }}
      >
        {(props) => (
          // {/* title and form */}

          // <KeyboardAvoidingView
          //   behaviour={Platform.OS === "ios" ? "padding" : "height"}
          //   className="h-full w-full flex justify-around pt-10 pb-10"
          // >
          // <View style={{flex: 1}}>
          <ScrollView
            automaticallyAdjustKeyboardInsets={true}
            scrollEnabled={false}
          >
            {/* Title */}
            <View className="flex items-center">
              <Image
                source={{ uri: logo1 }}
                style={{
                  width: width < 450 ? RFValue(200) : 400,
                  height: width < 450 ? RFValue(200) : 400,
                  marginTop: RFValue(150),
                  shadowColor: "#D3D3D3",
                  shadowColor: "#000",
                  shadowOffset: {
                    width: 0,
                    height: 4,
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: RFValue(3.84),
                  elevation: 5,
                }}
              />
              <Text
                style={{
                  fontSize: RFValue(20),
                  fontWeight: "bold",
                  color: "black",
                }}
              >
                VOLUNTEER COMPASS
              </Text>
            </View>

            {/* Form */}
            <View
              className="flex items-center mx-4 space-y-4"
              style={styles.LoginBlock}
            >
              <View
                className="bg-black/5 p-3 px-5 rounded-2xl w-full"
                style={styles.Email}
              >
                <TextInput
                  placeholder="Email"
                  placeholderTextColor={"gray"}
                  value={props.values.email}
                  keyboardType="email-address"
                  onChangeText={props.handleChange("email")}
                  onBlur={props.handleBlur("email")}
                  style={[styles.input, { fontSize: RFValue(14) }]}
                />
                {props.touched.email && props.errors.email && (
                  <Text style={styles.errorTxt}>{props.errors.email}</Text>
                )}
              </View>
              <View
                className="bg-black/5 p-3 px-5 rounded-2xl w-full mb-3"
                style={styles.Password}
              >
                <TextInput
                  placeholder="Password"
                  placeholderTextColor={"gray"}
                  secureTextEntry
                  value={props.values.password}
                  onChangeText={props.handleChange("password")}
                  onBlur={props.handleBlur("password")}
                  style={[styles.input, { fontSize: RFValue(14) }]}
                />
                {props.touched.password && props.errors.password && (
                  <Text style={styles.errorTxt}>{props.errors.password}</Text>
                )}
              </View>

              {/* Button */}
              <View className="w-full" style={{ alignItems: "center" }}>
                <TouchableOpacity
                  style={{
                    backgroundColor: "#20a963",
                    width: width < 450 ? "100%" : 600,
                    // height: width < 450 ? 50 : 60,
                    shadowColor: "#D3D3D3",
                    shadowColor: "#000",
                    shadowOffset: {
                      width: 0,
                      height: 4,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: RFValue(3.84),
                    elevation: 5,
                  }}
                  className="w-full p-3 rounded-2xl mb-3"
                  onPress={props.handleSubmit}
                >
                  <Text
                    className="text-xl font-bold text-white text-center"
                    style={{ fontSize: RFValue(16), padding: RFValue(5) }}
                  >
                    Login
                  </Text>
                </TouchableOpacity>
              </View>
              <View className="flex-row justify-center">
                <Text style={{ fontSize: RFValue(14) }}>
                  Don't have an account?{" "}
                </Text>
                <TouchableOpacity
                  onPress={() => navigation.replace("Sign Up")}
                  className="pr-1 pb-1"
                >
                  <Text style={{ color: "blue", fontSize: RFValue(14) }}>
                    Sign Up
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
          //  </View>
          // </KeyboardAvoidingView>
        )}
      </Formik>
    </ImageBackground>
    // </View>
  );
};

const styles = StyleSheet.create({
  LoginBlock: {
    marginTop: RFValue(50),
    justifyContent: width < 450 ? "flex-end" : "center",
    alignItems: "center",
  },
  input: {
    marginTop: RFValue(6),
  },
  Email: {
    backgroundColor: "white",
    width: width < 450 ? "100%" : 600,
    height: width < 450 ? RFValue(50) : 80,
    shadowColor: "#D3D3D3",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: RFValue(3.84),
    elevation: 5,
  },
  Password: {
    backgroundColor: "white",
    width: width < 450 ? "100%" : 600,
    height: width < 450 ? RFValue(50) : 80,
    shadowColor: "#D3D3D3",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: RFValue(3.84),
    elevation: 5,
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  errorTxt: {
    fontSize: RFValue(10),
    color: "red",
    fontWeight: "normal",
  },
});

export default Login;
