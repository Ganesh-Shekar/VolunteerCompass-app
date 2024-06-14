import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import {
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  ChevronRightIcon,
} from "react-native-heroicons/outline";
import BackButton from "../../components/backButton";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { logout } from "../../backend/getApiRequests";

const Account = () => {
  const navigation = useNavigation();
  async function logOut() {
    AsyncStorage.setItem("isLoggedIn", "false");
    AsyncStorage.setItem("token", "");
    AsyncStorage.setItem("user_data", "");
    navigation.replace("LoginUser");
    try {
      const response = await logout({});
      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  async function getData() {
    const getName = await AsyncStorage.getItem("first_name");
    const getLastName = await AsyncStorage.getItem("last_name");
    const getEmail = await AsyncStorage.getItem("email");
    setName(getName);
    setLastName(getLastName);
    setEmail(getEmail);
  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <View className="bg-white pt-3">
        <BackButton />
      </View>
      <View style={styles.container}>
        <UserCircleIcon size={90} style={{ marginTop: "4%" }} />
        <Text style={{ fontSize: 45 }}>{name + " " + lastName}</Text>
        <Text style={{ fontSize: 20 }}>{email}</Text>
        <View style={{ fontSize: 20, paddingBottom: "10%" }} />

        <TouchableOpacity
          style={[
            styles.aboutPage,
            { borderTopWidth: StyleSheet.hairlineWidth },
          ]}
        >
          <Text style={{ fontSize: 30 }}>Privacy Policy</Text>
          <ChevronRightIcon size={30} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.aboutPage}>
          <Text style={{ fontSize: 30 }}>Terms and Conditions</Text>
          <ChevronRightIcon size={30} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.aboutPage}>
          <Text style={{ fontSize: 30 }}>Licenses</Text>
          <ChevronRightIcon size={30} />
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            bottom: 0,
            marginBottom: "10%",
            paddingTop: "4%",
          }}
          onPress={logOut}
        >
          <ArrowRightOnRectangleIcon style={{ paddingRight: 30 }} />
          <Text style={{ fontSize: 20 }}>Log Out</Text>
        </TouchableOpacity>
        <StatusBar style="auto" />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  aboutPage: {
    flexDirection: "row",
    alignItems: "center",
    width: "95%",
    paddingVertical: "2%",
    borderBottomWidth: StyleSheet.hairlineWidth,
    justifyContent: "space-between",
  },
});

export default Account;
