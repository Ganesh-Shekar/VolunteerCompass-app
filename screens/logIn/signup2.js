import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform,
  Alert,
  KeyboardAvoidingView,
} from "react-native";
import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { useNavigation } from "@react-navigation/native";
import { RadioButton } from "react-native-paper";
import { Dropdown } from "react-native-element-dropdown";
import {
  signUpNgo,
  signUpUser,
  getCategories,
} from "../../backend/getApiRequests";

import { Formik } from "formik";
import * as yup from "yup";

const ngoSignUpValidationSchema = yup.object().shape({
  userName: yup
    .string()
    .min(3, "Username is too short")
    .max(50, "Username is too long")
    .required("Username is required"),

  ngoEmail: yup
    .string()
    .email("Enter a valid Email Address")
    .required("Email is required"),

  number: yup
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(19, "Phone number can be maximum 19 digits")
    .required("Phone number is required"),

  ngoPassword: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),

  ngoConfirmPassword: yup
    .string()
    .oneOf([yup.ref("ngoPassword"), null], "Passwords must match")
    .required("Confirm Password is required"),

  address: yup
    .string()
    .min(3, "Address is too short")
    .required("Address is required"),

  category: yup.string().required("Select a category from the list"),
});

const userSignUpValidationSchema = yup.object().shape({
  firstName: yup
    .string()
    .min(3, "Firstname is too short")
    .max(50, "Firstname is too long")
    .required("Firstname is required"),
  lastName: yup
    .string()
    .min(3, "Lastname is too short")
    .max(50, "Lastname is too long")
    .required("Lastname is required"),

  userEmail: yup
    .string()
    .email("Enter a valid Email")
    .required("User email is required"),

  userPassword: yup
    .string()
    .min(6, "User password must be at least 6 characters")
    .required("User password is required"),

  userConfirmPassword: yup
    .string()
    .oneOf([yup.ref("userPassword"), null], "Passwords must match")
    .required("Confirm Password is required"),

  age: yup.string().required("Age is required"),
});

const Signup = () => {
  const navigation = useNavigation();
  const [selectedValue, setSelectedValue] = useState("NGO"); // for radio buttons
  const [data, setData] = useState([]);
  const [category, setCategory] = useState(null);

  const ngoRequestObject = {
    userName: "",
    ngoEmail: "",
    number: "",
    ngoPassword: "",
    ngoConfirmPassword: "",
    address: "",
    category: null,
  };

  const userRequestObject = {
    firstName: "",
    lastName: "",
    userEmail: "",
    userPassword: "",
    userConfirmPassword: "",
    age: "",
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await getCategories();
      if (res !== null && res !== undefined) {
        const formattedCategories = res.map((item) => ({
          label: item.name,
          value: item.name,
        }));
        setData(formattedCategories);
      }
    } catch (error) {
      console.log('Error fetching categories: ', error);
    }
  };

  const registerNGO = async (userInfo) => {
    await signUpNgo(userInfo)
      .then((response) => {
        console.log(
          "===============>signUpNgo: response" + JSON.stringify(response)
        );
        if (response != null || response != undefined) {
          Alert.alert("Ngo registered successfully");
          navigation.replace("Login");
        }
      })
      .catch(async (err) => {
        console.log("===============>signUpNgo: catch" + JSON.stringify(err));
        Alert.alert(err);
      });
  };

  const registerUser = async (userInfo) => {
    // const url = "https://volcomp.pythonanywhere.com/signup-user";
    // let response = fetch(url, {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(
    //     firstName,
    //     lastName,
    //     email,
    //     password,
    //     reEnterPassword,
    //     age
    //   ),
    // });
    // result = await response.json();
    // if (result) {
    //   console.warn("Successfully signed up user");
    // }
    await signUpUser(userInfo)
      .then((response) => {
        console.log(
          "===============>signUpUser: response" + JSON.stringify(response)
        );
        if (response != null || response != undefined) {
          Alert.alert("User registered successfully");
          navigation.replace("Login");
        }
      })
      .catch(async (err) => {
        console.log("===============>signUpUser: catch" + JSON.stringify(err));
        Alert.alert(err);
      });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="bg-white h-full w-full"
    >
      {/* Background */}
      {/* <Image className="w-full h-full absolute" source={require('../../assets/images/background.png')}/> */}

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* handshake */}
        {/* <View className="flex-row justify-around w-full absolute">
            <Image className="h-[250] w-[250]" source={require('../../assets/images/handshake2.png')}/>
          </View> */}

        {/* title and form */}
        <View className="h-full w-full flex justify-around pt-25 pb-10">
          {/* Title */}
          <View style={{ marginTop: 10 }} className="flex items-center">
            <Text className="text-black font-bold tracking-wider text-3xl mt-5">
              Sign Up
            </Text>
          </View>
          <View style={{ flexDirection: "row", margin: 15, flexWrap: "wrap" }}>
            {/* Add a label */}
            <Text
              style={{
                marginRight: 10,
                fontSize: 18,
                textAlign: "center",
                textAlignVertical: "center",
              }}
            >
              Who are you?
            </Text>

            {/* Create a RadioButton.Group */}
            <RadioButton.Group
              onValueChange={(value) => setSelectedValue(value)}
              value={selectedValue}
            >
              {/* Create individual radio buttons with labels */}
              <View className="flex-row items-center">
                <View className="flex-row items-center">
                  <View style={styles.radioButton}>
                    <RadioButton value="NGO" color="green" />
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
          <Formik
            key={selectedValue}
            initialValues={
              selectedValue === "NGO" ? ngoRequestObject : userRequestObject
            } // Initial values for form fields
            validationSchema={
              selectedValue === "NGO"
                ? ngoSignUpValidationSchema
                : userSignUpValidationSchema
            } // Validation schema
            onSubmit={(values, actions) => {
              // Handle form submission
              console.log(JSON.stringify(values)); // You can replace this with your submission logic
              const tempRequestObject = {
                ngo_display_name: values.userName,
                contact_email: values.ngoEmail,
                contact_number: values.number,
                password: values.ngoPassword,
                address: values.address,
                category: values.category,
              };
              const userRequestObject = {
                first_name: values.firstName,
                last_name: values.lastName,
                contact_email: values.userEmail,
                password: values.userPassword,
                age: values.age,
              };

              selectedValue === "NGO"
                ? registerNGO(tempRequestObject)
                : registerUser(userRequestObject);
            }}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
              setFieldValue,
            }) => (
              <View>
                {selectedValue === "NGO" ? (
                  <View className="flex items-center mx-4 space-y-4">
                    <View className="bg-black/5 p-3 rounded-2xl w-full">
                      <TextInput
                        placeholder="Username"
                        placeholderTextColor={"gray"}
                        value={values.userName}
                        onChangeText={handleChange("userName")}
                        onBlur={handleBlur("userName")}
                      />
                      {touched.userName && errors.userName && (
                        <Text style={styles.errorTxt}>{errors.userName}</Text>
                      )}
                    </View>
                    <View className="bg-black/5 p-3 rounded-2xl w-full">
                      <TextInput
                        placeholder="Email"
                        placeholderTextColor={"gray"}
                        inputMode="email"
                        value={values.ngoEmail}
                        onChangeText={handleChange("ngoEmail")}
                        onBlur={handleBlur("ngoEmail")}
                      />
                      {touched.ngoEmail && errors.ngoEmail && (
                        <Text style={styles.errorTxt}>{errors.ngoEmail}</Text>
                      )}
                    </View>
                    <View className="bg-black/5 p-3 rounded-2xl w-full">
                      <TextInput
                        placeholder="Phone Number"
                        placeholderTextColor={"gray"}
                        inputMode="numeric"
                        value={values.number}
                        onChangeText={handleChange("number")}
                        onBlur={handleBlur("number")}
                      />
                      {touched.number && errors.number && (
                        <Text style={styles.errorTxt}>{errors.number}</Text>
                      )}
                    </View>
                    <View className="bg-black/5 p-3 rounded-2xl w-full">
                      <TextInput
                        placeholder="Password"
                        placeholderTextColor={"gray"}
                        value={values.ngoPassword}
                        onChangeText={handleChange("ngoPassword")}
                        onBlur={handleBlur("ngoPassword")}
                      />
                      {touched.ngoPassword && errors.ngoPassword && (
                        <Text style={styles.errorTxt}>
                          {errors.ngoPassword}
                        </Text>
                      )}
                    </View>
                    <View className="bg-black/5 p-3 rounded-2xl w-full">
                      <TextInput
                        placeholder="Confirm Password"
                        placeholderTextColor={"gray"}
                        secureTextEntry
                        value={values.ngoConfirmPassword}
                        onChangeText={handleChange("ngoConfirmPassword")}
                        onBlur={handleBlur("ngoConfirmPassword")}
                      />
                      {touched.ngoConfirmPassword &&
                        errors.ngoConfirmPassword && (
                          <Text style={styles.errorTxt}>
                            {errors.ngoConfirmPassword}
                          </Text>
                        )}
                    </View>
                    <View className="bg-black/5 p-3 rounded-2xl w-full">
                      <TextInput
                        placeholder="Address"
                        placeholderTextColor={"gray"}
                        value={values.address}
                        onChangeText={handleChange("address")}
                        onBlur={handleBlur("address")}
                      />
                      {touched.address && errors.address && (
                        <Text style={styles.errorTxt}>{errors.address}</Text>
                      )}
                    </View>

                    <View className="bg-black/5 p-3 rounded-2xl w-full">
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
                        placeholder={"Select Category"}
                        searchPlaceholder="Search..."
                        value={category}
                        onChange={(item) => {
                          setFieldValue("category", item.value); // Correctly set the formik field value
                          setCategory(item.value);
                        }}
                      />
                      {touched.category && errors.category && (
                        <Text style={styles.errorTxt}>{errors.category}</Text>
                      )}
                    </View>

                    <TouchableOpacity
                      className="w-full p-3 rounded-2xl mb-3"
                      onPress={handleSubmit}
                      style={{backgroundColor: "#20a963"}}
                    >
                      <Text className="text-xl font-bold text-white text-center">
                        Sign Up
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View className="flex items-center mx-4 space-y-4">
                    <View className="bg-black/5 p-3 rounded-2xl w-full">
                      <TextInput
                        placeholder="First name"
                        placeholderTextColor={"gray"}
                        value={values.firstName}
                        onChangeText={handleChange("firstName")}
                        onBlur={handleBlur("firstName")}
                      />
                      {touched.firstName && errors.firstName && (
                        <Text style={styles.errorTxt}>{errors.firstName}</Text>
                      )}
                    </View>
                    <View className="bg-black/5 p-3 rounded-2xl w-full">
                      <TextInput
                        placeholder="Last name"
                        placeholderTextColor={"gray"}
                        value={values.lastName}
                        onChangeText={handleChange("lastName")}
                        onBlur={handleBlur("lastName")}
                      />
                      {touched.lastName && errors.lastName && (
                        <Text style={styles.errorTxt}>{errors.lastName}</Text>
                      )}
                    </View>
                    <View className="bg-black/5 p-3 rounded-2xl w-full">
                      <TextInput
                        placeholder="Email"
                        placeholderTextColor={"gray"}
                        inputMode="email"
                        value={values.userEmail}
                        onChangeText={handleChange("userEmail")}
                        onBlur={handleBlur("userEmail")}
                      />
                      {touched.userEmail && errors.userEmail && (
                        <Text style={styles.errorTxt}>{errors.userEmail}</Text>
                      )}
                    </View>
                    <View className="bg-black/5 p-3 rounded-2xl w-full">
                      <TextInput
                        placeholder="Password"
                        placeholderTextColor={"gray"}
                        value={values.userPassword}
                        onChangeText={handleChange("userPassword")}
                        onBlur={handleBlur("userPassword")}
                      />
                      {touched.userPassword && errors.userPassword && (
                        <Text style={styles.errorTxt}>
                          {errors.userPassword}
                        </Text>
                      )}
                    </View>
                    <View className="bg-black/5 p-3 rounded-2xl w-full">
                      <TextInput
                        placeholder="Confirm Password"
                        placeholderTextColor={"gray"}
                        secureTextEntry
                        value={values.userConfirmPassword}
                        onChangeText={handleChange("userConfirmPassword")}
                        onBlur={handleBlur("userConfirmPassword")}
                      />
                      {touched.userConfirmPassword &&
                        errors.userConfirmPassword && (
                          <Text style={styles.errorTxt}>
                            {errors.userConfirmPassword}
                          </Text>
                        )}
                    </View>
                    <View className="bg-black/5 p-3 rounded-2xl w-full">
                      <TextInput
                        inputMode="numeric"
                        placeholder="Age"
                        placeholderTextColor={"gray"}
                        value={values.age}
                        onChangeText={handleChange("age")}
                        onBlur={handleBlur("age")}
                      />
                      {touched.age && errors.age && (
                        <Text style={styles.errorTxt}>{errors.age}</Text>
                      )}
                    </View>

                    <TouchableOpacity
                      className="w-full p-3 rounded-2xl mb-3"
                      onPress={handleSubmit}
                      style={{backgroundColor: "#20a963"}}
                    >
                      <Text className="text-xl font-bold text-white text-center">
                        Sign Up
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            )}
          </Formik>

          {/* Button */}
          <View style={{ marginHorizontal: 15, marginTop: 5 }}>
            <View className="flex-row justify-center">
              <Text>Already have an account? </Text>
              <TouchableOpacity
                onPress={() => navigation.replace("Login")}
                className="pr-1 pb-1"
              >
                <Text style={{ color: "#20a963" }}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
      <StatusBar style="auto" />
    </KeyboardAvoidingView>
  );
};

export default Signup;

const styles = StyleSheet.create({
  errorTxt: {
    fontSize: 12,
    color: "red",
    fontWeight: "normal",
    marginTop: 5,
  },

  dropdown: {
    borderBottomColor: "gray",
    borderBottomWidth: 0.5,
  },

  placeholderStyle: {
    fontSize: 14.5,
    color: "gray",
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
    borderWidth: Platform.OS === "ios" ? 2 : null,
    borderColor: "black",
    borderRadius: 999,
    marginRight: 5,
    padding: 0.1
  },
});
