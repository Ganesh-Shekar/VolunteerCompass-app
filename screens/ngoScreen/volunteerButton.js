import React, { useEffect, useState } from "react";
import {
  View,
  Button,
  StyleSheet,
  TouchableOpacity,
  Text,
  Alert,
  Modal,
  Dimensions,
} from "react-native";
import {
  addVolunteerToEvent,
  removeVolunteerFromEvent,
  checkUserRegistration,
} from "../../backend/getApiRequests";
import { RFValue } from "react-native-responsive-fontsize";
const { width, height } = Dimensions.get("window");

const VolunteerButton = ({ event, saved_ngo }) => {
  const [showModal, setShowModal] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  //Check for user registration
  async function checkRegistration() {
    try {
      const isUserRegistered = await checkUserRegistration(
        "",
        saved_ngo || "",
        event.event_id || ""
      );
      const res = isUserRegistered.registered;
      if (res === true) {
        setIsRegistered(true);
      } else if (res === false) {
        setIsRegistered(false);
      }
    } catch (error) {
      console.error("Error checking registration: ", error);
    }
  }

  async function setVounteer() {
    try {
      const response = await addVolunteerToEvent("", saved_ngo, event.event_id);
      if (response == "Success") {
        setIsRegistered(true);
        if (!isRegistered) {
          Alert.alert("Registration successful");
        }
      } else {
        Alert.alert("Registration failed");
      }
    } catch (error) {
      throw error;
    }
  }

  async function removeVolunteer() {
    try {
      const response = await removeVolunteerFromEvent(
        "",
        saved_ngo,
        event.event_id
      );
      if (response == "Success") {
        setIsRegistered(false);
      }
    } catch (error) {
      throw error;
    }
  }

  useEffect(() => {
    checkRegistration();
  });

  return (
    <View>
      <Modal transparent={true} visible={showModal} animationType="slide">
        <View style={styles.centerView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              {isRegistered
                ? "You sure you want to unenroll for this event?"
                : "You sure you want to volunteer for this?"}
            </Text>
            <Button
              title="Yes"
              color={"#20A963"}
              onPress={() => {
                setShowModal(false);
                isRegistered ? removeVolunteer() : setVounteer();
              }}
            />
            <Button
              title="No, take me back"
              color={"#20A963"}
              onPress={() => setShowModal(false)}
            />
          </View>
        </View>
      </Modal>

      <TouchableOpacity
        style={{
          paddingBottom: RFValue(10),
          width: width < 450 ? 300 : 500,
          // alignItems: "center",
        }}
        onPress={() => {
          setShowModal(true);
        }}
      >
        <View
          style={{
            ...styles.screenContainer,
            backgroundColor: isRegistered ? "#dc3545" : "#28a745",
          }}
          className="flex-row items-center bg-white p-2 rounded-3xl shadow-1xl mb-3 mx-2"
        >
          <Text style={{ color: "#ffffff", fontSize: RFValue(12) }}>
            {isRegistered ? "Unregister" : "Volunteer"}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    justifyContent: "center",
    padding: 1,
    backgroundColor: "#20A963",
  },
  appButtonContainer: {
    elevation: 8,
    backgroundColor: "#00960B",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    // alignContent: "center",
  },
  appButtonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    alignSelf: "center",
    textTransform: "uppercase",
  },

  centerView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  modalText: {
    fontSize: 17,
    marginBottom: 20,
    textAlign: "center",
  },

  buttonView: {
    color: "white",
  },

  modalView: {
    backgroundColor: "#f8f8f8",
    padding: 35,
    borderRadius: 20,
    shadowColour: "#D3D3D3",
    elevation: 5,
  },
});

export default VolunteerButton;
