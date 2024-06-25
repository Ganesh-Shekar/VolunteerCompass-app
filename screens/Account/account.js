import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Modal,
  Image,
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

const Account = () => {
  const navigation = useNavigation();
  const [privacyModalVisible, setPrivacyModalVisible] = useState(false);
  const [termsModalVisible, setTermsModalVisible] = useState(false);
  const [licensesModalVisible, setLicensesModalVisible] = useState(false);
  const [image, setImage] = useState(null);
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

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
  const [phone, setPhone] = useState("");

  async function getData() {
    const getName = await AsyncStorage.getItem("first_name");
    const getLastName = await AsyncStorage.getItem("last_name");
    const getEmail = await AsyncStorage.getItem("email");
    const getPhone = await AsyncStorage.getItem("phone");
    setName(getName);
    setLastName(getLastName);
    setEmail(getEmail);
    setPhone(getPhone);
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
        <TouchableOpacity onPress={() => navigation.navigate("")}>
        < View style={{ alignItems: "center", marginTop: "10%" }} >
        <TouchableOpacity onPress={pickImage}>
          <UserCircleIcon size={90} style={{ marginTop: "4%" }} />
          {image && <Image source={{ uri: image }} style={styles.image} />}
        </TouchableOpacity>
        <Text style={{ fontSize: 45 }}>{name + "" + lastName}</Text>
        <Text style={{ fontSize: 20 }}>{email}</Text>
        {phone ? (
          <Text style={{ fontSize: 20, marginTop: 5 }}>{phone}</Text>
        ) : null}
        <View style={{ fontSize: 20, paddingBottom: "10%" }} />
        </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.aboutPage,
            { borderTopWidth: StyleSheet.hairlineWidth },
          ]}
          onPress={() => setPrivacyModalVisible(true)}
        >
          <Text style={{ fontSize: 30 }}>Privacy Policy</Text>
          <ChevronRightIcon size={30} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.aboutPage}
          onPress={() => setTermsModalVisible(true)}
        >
          <Text style={{ fontSize: 30 }}>Terms and Conditions</Text>
          <ChevronRightIcon size={30} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.aboutPage}
          onPress={() => setLicensesModalVisible(true)}
        >
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

      <Modal
        animationType="slide"
        transparent={true}
        visible={privacyModalVisible}
        onRequestClose={() => setPrivacyModalVisible(false)}
      >
        <View style={styles.modalView}>
          <ScrollView style={styles.scrollView}>
            <Text style={styles.modalText}>
              <PrivacyPolicyText />
            </Text>
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
            <Text style={styles.modalText}>
              <TermsAndConditionsText />
            </Text>
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
            <Text style={styles.modalText}>
              <LicensesText />
            </Text>
          </ScrollView>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setLicensesModalVisible(false)}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
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
    marginHorizontal: 10,
    width: "100%",
  },
  modalText: {
    fontSize: 18,
    textAlign: "center",
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#2196F3",
    borderRadius: 5,
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
  },
});

export default Account;
