import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Modal,
  Image,
  Dimensions,
  Alert,
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
import PrivacyPolicyText from "./PrivacyPolicyText";
import TermsAndConditionsText from "./TermsAndConditionsText";
import LicensesText from "./LicensesText";
import * as ImagePicker from "expo-image-picker";
import AccountEdit from "./AccountEdit";
const { width } = Dimensions.get("window");
import { RFValue } from "react-native-responsive-fontsize";
import { SafeAreaView } from "react-native-safe-area-context";

const Account = () => {
  const navigation = useNavigation();
  const [privacyModalVisible, setPrivacyModalVisible] = useState(false);
  const [termsModalVisible, setTermsModalVisible] = useState(false);
  const [licensesModalVisible, setLicensesModalVisible] = useState(false);
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  async function logOut() {
    try {
      const response = await logout({});
      if (response && response.msg === "JWT revoked") {
        Alert.alert("Logged out successfully");
        AsyncStorage.removeItem("jwtToken");
        AsyncStorage.removeItem("refreshToken");
        AsyncStorage.setItem("isLoggedIn", "false");
        AsyncStorage.setItem("token", "");
        AsyncStorage.setItem("user_data", "");
        await AsyncStorage.clear(); // Clears all AsyncStorage data
        navigation.replace("LoginUser");
      } else {
        console.log("Logout failed or did not return the expected response");
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  async function getData() {
    const getName = await AsyncStorage.getItem("first_name");
    const getLastName = await AsyncStorage.getItem("last_name");
    const getEmail = await AsyncStorage.getItem("email");
    const getPhone = await AsyncStorage.getItem("phone");
    const getType = await AsyncStorage.getItem("type");
    if (getType === "user") {
      setName(getName);
      setLastName(getLastName);
      setEmail(getEmail);
      setPhone(getPhone);
    } else {
      setName(getName);
      setLastName("");
      setEmail(getEmail);
      setPhone(getPhone);
    }
  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <BackButton />
      </View>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => navigation.navigate("")}>
          <View style={styles.profileContainer}>
            <UserCircleIcon size={90} style={styles.profileIcon} />
            {image && <Image source={{ uri: image }} style={styles.image} />}
            <Text style={styles.nameText}>{name + "" + lastName}</Text>
            <Text style={styles.emailText}>{email}</Text>
            {phone && <Text style={styles.phoneText}>{phone}</Text>}
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.aboutPage}
          onPress={() => setPrivacyModalVisible(true)}
        >
          <Text style={styles.aboutText}>Privacy Policy</Text>
          <ChevronRightIcon size={30} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.aboutPage}
          onPress={() => setTermsModalVisible(true)}
        >
          <Text style={styles.aboutText}>Terms and Conditions</Text>
          <ChevronRightIcon size={30} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.aboutPage}
          onPress={() => setLicensesModalVisible(true)}
        >
          <Text style={styles.aboutText}>Licenses</Text>
          <ChevronRightIcon size={30} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.logoutContainer}
        onPress={() => {
          Alert.alert(
            "Log Out",
            "Are you sure you want to log out?",
            [
              { text: "No", style: "cancel" },
              { text: "Yes, logout", onPress: () => logOut() },
            ],
            { cancelable: false }
          );
        }}
      >
        <ArrowRightOnRectangleIcon style={styles.logoutIcon} />
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
      <StatusBar style="auto" />

      <Modal
        animationType="slide"
        transparent={true}
        visible={privacyModalVisible}
        onRequestClose={() => setPrivacyModalVisible(false)}
      >
        <View style={styles.modalView}>
          <ScrollView style={styles.scrollView}>
            <PrivacyPolicyText />
          </ScrollView>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setPrivacyModalVisible(false)}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={termsModalVisible}
        onRequestClose={() => setTermsModalVisible(false)}
      >
        <View style={styles.modalView}>
          <ScrollView style={styles.scrollView}>
            <TermsAndConditionsText />
          </ScrollView>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setTermsModalVisible(false)}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={licensesModalVisible}
        onRequestClose={() => setLicensesModalVisible(false)}
      >
        <View style={styles.modalView}>
          <ScrollView style={styles.scrollView}>
            <LicensesText />
          </ScrollView>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setLicensesModalVisible(false)}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    alignItems: "center",
  },
  profileContainer: {
    alignItems: "center",
    marginTop: 40,
  },
  profileIcon: {
    color: "#4a4a4a",
    marginBottom: 10,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginTop: 10,
  },
  nameText: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#333",
  },
  emailText: {
    fontSize: 18,
    color: "#666",
    marginTop: 5,
  },
  phoneText: {
    fontSize: 18,
    color: "#666",
    marginTop: 5,
  },
  aboutPage: {
    flexDirection: "row",
    alignItems: "center",
    width: "95%",
    paddingVertical: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#ddd",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    marginVertical: 5,
    borderRadius: 10,
  },
  aboutText: {
    fontSize: 20,
    color: "#333",
  },
  logoutContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    bottom: 0,
    marginBottom: "10%",
    paddingTop: "4%",
  },
  logoutIcon: {
    paddingRight: 10,
    color: "#ff0000",
  },
  logoutText: {
    fontSize: 20,
    color: "#ff0000",
  },
  modalView: {
    flex: 1,
    backgroundColor: "white",
    marginTop: 50,
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollView: {
    width: "100%",
  },
  modalText: {
    fontSize: 18,
    textAlign: "center",
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#20a963",
    borderRadius: 5,
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
  },
});

export default Account;
