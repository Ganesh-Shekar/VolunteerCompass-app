import { View, Text, Image, TextInput, TouchableOpacity, ScrollView, StyleSheet, Platform, Alert, KeyboardAvoidingView } from 'react-native'
import React, { useState, useEffect } from 'react'
import { StatusBar } from 'expo-status-bar'
import { useNavigation } from '@react-navigation/native'
import { RadioButton } from 'react-native-paper';
import { Dropdown } from 'react-native-element-dropdown';
import { signUpNgo, signUpUser, getAllCategories } from '../../backend/getApiRequests';

const Signup = () => {
  const navigation = useNavigation()
  // const userInfo = {
  //   "password":"",
  //   "ngo_display_name":"",
  //   "contact_phone":1234567890,
  //   "contact_email":"",
  //   "description":"",
  //   "address":"",
  //   "category_id":"",
  //   "registration/verification_id":"",
  //   "working_hours":"",
  //   "founding_year":2017,
  //   "active_years":5,
  //   "category":"education"
  // }
  // const [data, setData] = useState([])

  // const fetchCategories = async () => {
  //   await getAllCategories()
  //     .then(res => {
  //       if (res != null || res != undefined) {
  //         setData()
  //       }
  //     })
  //     .catch(async error => {
  //       //Alert
  //     });
  // }

  // const data = [
  //   { label: 'Education', value: 'Education' },
  //   { label: 'Clean Initiatives', value: 'CI' },
  // ]; 

  const [data, setData] = useState([])
  const [selectedValue, setSelectedValue] = useState('NGO') // for radio buttons

  // for user
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [age, setAge] = useState(null);

  // for NGO
  const [username, setUsername] = useState(null);
  const [number, setNumber] = useState(null);
  const [address, setAddress] = useState(null);
  const [category, setCategory] = useState(null); // for dropdown selection
  
  // common fields
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [reEnterPassword, setReEnterPassword] = useState(null);

  useEffect(()=>{
    getCategoriesList();
  },[]);

  async function getCategoriesList() {
    try {
        const response = await getAllCategories();
        const filteredResponse = response.map(column => ({
          label: column.name,
          value: column.category_id
        }));
        setData(filteredResponse);
    } catch (error) {
        console.error(error);
        throw error;
    }
  }
  
  const signUpUser = async() => {
    const url = 'https://volcomp.pythonanywhere.com/signup-user'
    let response = fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(firstName, lastName, email, password, reEnterPassword, age)
    })
    result = await response.json()
    if (result) {
      console.warn('Successfully signed up user')
    }
  }

  const mRegisterAccount = async (userInfo) => {
    await signUpNgo(userInfo)
    .then(response => {
      if (response != null || response != undefined) {
        Alert.alert("User sign up successfull")
        // navigation.navigate("Login")
      }
    })
    .catch(async err => {
      Alert.alert(err)
    })
  }

  // useEffect(() => {
  //   fetchCategory()
  // })

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="bg-white h-full w-full">


        <ScrollView alwaysBounceVertical={false} showsVerticalScrollIndicator={false}>

          {/* title and form */}
          <View className="h-full w-full flex justify-around pt-40 pb-10">
              {/* Title */}
              <View className="flex items-center">
                <Text className="text-black font-bold tracking-wider text-5xl mt-5" >
                  Sign Up
                </Text>
              </View>
              <View className="pt-10 items-center">
                {/* Add a label */}
                <Text className="text-black font-bold tracking-wider text-3xl mb-2">Who are you?</Text>
                
                {/* Create a RadioButton.Group */}
                <RadioButton.Group
                  onValueChange={(value) => setSelectedValue(value)}
                  value={selectedValue}
                >
                  {/* Create individual radio buttons with labels */}
                  <View className="flex-row items-center mb-2">
                    <View className="flex-row items-center mx-4 mb-2">
                      <View style={styles.radioButton}>
                        <RadioButton value="NGO" color="green"/>
                      </View>
                      <Text className="text-lg">NGO</Text>
                    </View>
                    <View className="flex-row items-center mx-4">
                      <View style={styles.radioButton}>
                        <RadioButton value="User" color="green" />
                      </View>
                      <Text className="text-lg">User</Text>
                    </View>
                  </View>
                </RadioButton.Group>
              </View>

              {/* Form */}
              {selectedValue === 'NGO' ?
                <View className="flex items-center mx-4 space-y-4">
                  <View className="bg-black/5 p-5 rounded-2xl w-full">
                    <TextInput placeholder="Username" placeholderTextColor={"gray"} onChangeText={(text) => setUsername(text)}/>
                  </View>
                  <View className="bg-black/5 p-5 rounded-2xl w-full">
                    <TextInput placeholder="Email" placeholderTextColor={"gray"} onChangeText={(text) => setEmail(text)}/>
                  </View>
                  <View className="bg-black/5 p-5 rounded-2xl w-full">
                    <TextInput placeholder="Number" placeholderTextColor={"gray"} onChangeText={(text) => setNumber(text)}/>
                  </View>
                  <View className="bg-black/5 p-5 rounded-2xl w-full">
                    <TextInput placeholder="Password" placeholderTextColor={"gray"} secureTextEntry onChangeText={(text) => setPassword(text)}/>
                  </View>
                  <View className="bg-black/5 p-5 rounded-2xl w-full">
                    <TextInput placeholder="Re-enter Password" placeholderTextColor={"gray"} secureTextEntry onChangeText={(text) => setReEnterPassword(text)}/>
                  </View>
                  <View className="bg-black/5 p-5 rounded-2xl w-full">
                    <TextInput placeholder="Address" placeholderTextColor={"gray"} onChangeText={(text) => setAddress(text)}/>
                  </View>
                  <View className="bg-black/5 p-5 rounded-2xl w-full">
                    <Dropdown
                      style={styles.dropdown}
                      placeholderStyle={styles.placeholderStyle}
                      selectedTextStyle={styles.selectedTextStyle}
                      inputSearchStyle={styles.inputSearchStyle}
                      iconStyle={styles.iconStyle}
                      data={data}
                      search
                      maxHeight={300}
                      labelField="label"
                      valueField="value"
                      placeholder="Select a Category"
                      searchPlaceholder="Search..."
                      value={category}
                      onChange={item => {
                        setCategory(item.category);
                      }}
                    />
                  </View>

                  {/* Button */}
                  <View className="w-full">
                    <TouchableOpacity className="w-full p-3 rounded-2xl mb-3" style={{backgroundColor:"#20a963"}}>
                      <Text className='text-xl font-bold text-white text-center'>Sign Up</Text>
                    </TouchableOpacity>
                  </View>
                  <View className="flex-row justify-center">
                    <Text>Already have an account? </Text>
                    <TouchableOpacity onPress={() => navigation.replace('Login')} className="pr-1 pb-1">
                      <Text style={{color:"#20a963"}}>Login</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              : null}

              {selectedValue === 'User' ?
                <View className="flex items-center mx-4 space-y-4">
                  <View className="bg-black/5 p-5 rounded-2xl w-full">
                    <TextInput placeholder="First Name" placeholderTextColor={"gray"} />
                  </View>
                  <View className="bg-black/5 p-5 rounded-2xl w-full">
                    <TextInput placeholder="Last Name" placeholderTextColor={"gray"} />
                  </View>
                  <View className="bg-black/5 p-5 rounded-2xl w-full">
                    <TextInput placeholder="Email" placeholderTextColor={"gray"} />
                  </View>
                  <View className="bg-black/5 p-5 rounded-2xl w-full">
                    <TextInput placeholder="Password" placeholderTextColor={"gray"} secureTextEntry/>
                  </View>
                  <View className="bg-black/5 p-5 rounded-2xl w-full">
                    <TextInput placeholder="Re-enter Password" placeholderTextColor={"gray"} secureTextEntry/>
                  </View>
                  <View className="bg-black/5 p-5 rounded-2xl w-full">
                    <TextInput placeholder="Age" placeholderTextColor={"gray"} />
                  </View>

                  {/* Button */}
                  <View className="w-full">
                    <TouchableOpacity className="w-full p-3 rounded-2xl mb-3" style={{backgroundColor:"#20a963"}}>
                      <Text className='text-xl font-bold text-white text-center'>Sign Up</Text>
                    </TouchableOpacity>
                  </View>
                  <View className="flex-row justify-center">
                    <Text>Already have an account? </Text>
                    <TouchableOpacity onPress={() => navigation.replace('Login')} className="pr-1 pb-1">
                      <Text style={{color:"#20a963"}}>Login</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              : null}
              
            
          </View>
        </ScrollView>
    </KeyboardAvoidingView>
  )
}

export default Signup

const styles = StyleSheet.create({
  dropdown: {
    borderBottomColor: 'gray',
    borderBottomWidth: 0.5,
  },
  placeholderStyle: {
    fontSize: 14.5,
    color: 'gray'
  },
  selectedTextStyle: {
    fontSize: 14.5,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 14.5,
  },
  radioButton: {
    borderWidth: Platform.OS === 'ios' ? 2: null,
    borderColor: 'black',
    borderRadius: 9999,
    marginRight: 8
  }
})