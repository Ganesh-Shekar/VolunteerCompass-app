import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native'
import React, { useEffect, useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import { useNavigation } from '@react-navigation/native'
import { RegisterLogin, signIn } from '../../backend/getApiRequests'
import { Form, Formik } from 'formik'
import * as yup from 'yup';
import AsyncStorage from '@react-native-async-storage/async-storage'

const ReviewSchema = yup.object({
  email:yup.string()
    .email("Please enter valid email address")
    .required("*Required"),
  password:yup.string()
    .required("*Required")
    .min(6, 'Password must be at least 6 characters long')
})

const Login = () => {

  const navigation = useNavigation()

  const handleLogin = async (userInfo) => {
    await signIn(userInfo)
      .then((response) => {
        if (response != null && response != undefined && response.statusCode === 200) {
          AsyncStorage.setItem('token', response.data["user_id"])
          AsyncStorage.setItem('first_name', response.data["first_name"])
          AsyncStorage.setItem('last_name', response.data["last_name"])
          AsyncStorage.setItem('email', response.data["contact_email"])
          AsyncStorage.setItem('isLoggedIn', JSON.stringify(true))
          navigation.replace('HomeScreen');
        }
        else if (response.statusCode === 101) {
          Alert.alert(response.message)
        }
        else if (response.statusCode === 102) {
          Alert.alert(response.message)
        }
      })
      .catch(async (err) => {
        console.log(JSON.stringify(err));
        Alert.alert(err);
      });
  };

  return (
    <View className="bg-white h-full w-full">
       
      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={ReviewSchema}
        onSubmit={(values) => {
          handleLogin(values)
        }}
      >
        {(props) => (
          // {/* title and form */}
          <KeyboardAvoidingView behaviour={Platform.OS === 'ios' ? 'padding' : 'height'} className="h-full w-full flex justify-around pt-40 pb-10">
            
            {/* Title */}
            <View className="flex items-center">
              <Text className="text-black font-bold tracking-wider text-5xl" >
                Login
              </Text>
            </View>

            {/* Form */}
            <View className="flex items-center mx-4 space-y-4">
              <View className="bg-black/5 p-5 rounded-2xl w-full">
                <TextInput 
                  placeholder="Email"
                  placeholderTextColor={"gray"} 
                  value={props.values.email}
                  keyboardType='email-address'
                  onChangeText={props.handleChange('email')}
                  onBlur={props.handleBlur('email')}
                />
                {props.touched.email && props.errors.email && (
                  <Text style={styles.errorTxt}>{props.errors.email }</Text>
                )}
              </View>
              <View className="bg-black/5 p-5 rounded-2xl w-full mb-3">
                <TextInput 
                placeholder="Password" 
                placeholderTextColor={"gray"} 
                secureTextEntry
                value={props.values.password}
                onChangeText={props.handleChange('password')}
                onBlur={props.handleBlur('password')}
                />
                {props.touched.password && props.errors.password && (
                  <Text style={styles.errorTxt}>{ props.errors.password }</Text>
                )}
              </View>

              {/* Button */}
              <View className="w-full">
                <TouchableOpacity style={{backgroundColor:"#20a963"}}className="w-full p-3 rounded-2xl mb-3" onPress={props.handleSubmit}>
                  <Text className='text-xl font-bold text-white text-center'>Login</Text>
                </TouchableOpacity>
              </View>
              <View className="flex-row justify-center">
                <Text>Don't have an account? </Text>
                <TouchableOpacity onPress={() => navigation.replace('Sign Up')} className='pr-1 pb-1'>
                  <Text style={{color:"#20a963"}}>Sign Up</Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        )}
               
      </Formik>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  input: {
    width: '80%',
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 10,
    margin: 12,
    width: '80%',
    alignItems: 'center',
    padding: 12,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  errorTxt: {
    fontSize: 12,
    color: "red",
    fontWeight: "normal",
    marginTop: 5,
  },
  titleForm: {
    height: '100%',
    width: '100%',
    display: 'flex',
    justifyContent: 'space-around',
    paddingTop: '10rem',
    paddingBottom: '2.5rem',
  }
});

export default Login