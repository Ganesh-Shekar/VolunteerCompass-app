import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  Touchable,
  TouchableWithoutFeedback,
  Button,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAllEventsVolunteeredByUser } from "../../backend/getApiRequests";
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RFValue } from "react-native-responsive-fontsize";
import Icon from "react-native-vector-icons/FontAwesome5";
import {
  getAllEventsByNgoId,
  deleteNgoEvent,
  getNgoEvent,
} from "../../backend/getApiRequests";
import { useNavigation } from "@react-navigation/native";
import EventRow from "../ngoScreen/EventRow";

const MyEvents = () => {
  const [selectedTab, setSelectedTab] = useState("upcoming");
  const [eventsList, setEventsList] = useState([]);
  const [userType, setUserType] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [ngoEventDetails, setNgoEventDetails] = useState([]);
  const navigation = useNavigation();

  async function getType() {
    const user_type = await AsyncStorage.getItem("type");
    setUserType(user_type);
  }

  async function deleteEvent(event_id) {
    try {
      const response = await deleteNgoEvent(event_id);
      setNgoEventDetails((prevDetails) =>
        prevDetails.filter((event) => event.event_id !== event_id)
      );
    } catch (error) {
      throw error;
    }
  }

  async function getEventDetails() {
    try {
      const events_per_ngo = await getAllEventsByNgoId(
        "774dc6a1-9a43-41af-8f81-82031061f54c"
      );
      setNgoEventDetails(events_per_ngo);
    } catch (error) {
      throw error;
    }
  }

  const fetchEvents = useCallback(async () => {
    try {
      const user = await AsyncStorage.getItem("token");
      if (user) {
        const response = await getAllEventsVolunteeredByUser(user);
        const eventsList = [];
        for (const date of Object.keys(response)) {
          for (const event of response[date]) {
            const eventDetails = await getDetailsofEvent(event.event_id);
            eventsList.push(eventDetails);
          }
        }
        setEventsList(eventsList);
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  async function getDetailsofEvent(eventId) {
    try {
      const response = await getNgoEvent(eventId);
      // console.log(response)
      return response;
    } catch (error) {
      throw error;
    }
  }

  //function to check if the given date is in the past or not
  function checkDate(givenDateString) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const givenDate = new Date(givenDateString);
    if (givenDate < today) {
      return true;
    } else {
      return false;
    }
  }

  const PastEvents = () => {
    const filteredEvents = eventsList.filter((event) =>
      checkDate(event[0].start_date)
    );
    if (filteredEvents.length === 0) {
      return (
        <Text style={{ textAlign: "center", marginTop: 20 }}>
          No Past Events
        </Text>
      );
    }

    return (
      <ScrollView
        style={{ backgroundColor: "white" }}
        className={"h-full w-full"}
      >
        {filteredEvents.map((event) => (
          <EventRow
            event={event[0]}
            showVolunteerButton={false}
            key={event[0].event_id}
          />
        ))}
      </ScrollView>
    );
  };

  const UpcomingEvents = () => (
    <ScrollView
      style={{ backgroundColor: "white" }}
      className={"h-full w-full"}
    >
      {eventsList.map(
        (event) =>
          !checkDate(event[0].start_date) && (
            <View key={event[0].event_id}>
              <Text
                style={{
                  fontSize: RFValue(14),
                  fontWeight: "bold",
                  marginTop: RFValue(4),
                }}
              >
                {event[0].date}
              </Text>
              <EventRow event={event[0]} showVolunteerButton={false} />
            </View>
          )
      )}
    </ScrollView>
  );

  const UpcomingEventsforNGO = () => (
    <ScrollView className={"h-full w-full"}>
      {ngoEventDetails.map(
        (events) =>
          !checkDate(events.start_date) && (
            <View key={events.event_id}>
              <View style={styles.editTrashIcon} key={events.event_id}>
                <TouchableOpacity
                  onPress={() => {
                    Alert.alert(
                      "Edit Event",
                      "Do you want to edit this event?",
                      [
                        {
                          text: "Cancel",
                          style: "cancel",
                        },
                        {
                          text: "OK",
                          onPress: () => {
                            navigation.navigate("CreateEditEvent", {
                              event_details: events,
                            });
                            setModalVisible(false);
                          },
                          style: "ok",
                        },
                      ]
                    );
                  }}
                >
                  <Icon name="pen" size={20}></Icon>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    Alert.alert(
                      "Delete Event",
                      "Are you sure you want to delete this?",
                      [
                        {
                          text: "Cancel",
                          style: "cancel",
                        },
                        {
                          text: "OK",
                          onPress: () => deleteEvent(events.event_id),
                        },
                      ]
                    );
                  }}
                >
                  <Icon
                    name="trash"
                    size={20}
                    color={"red"}
                    style={{ marginLeft: RFValue(10) }}
                  ></Icon>
                </TouchableOpacity>
              </View>
              <EventRow
                event={events}
                showVolunteerLimit={true}
                style={{ flexDirection: "row", flex: 1 }}
                showSlotsCount={true}
              />
            </View>
          )
      )}
    </ScrollView>
  );

  handleButtonPress = (ngo) => {
    navigation.navigate("CreateEditEvent", {});
    setModalVisible(false);
  };

  useFocusEffect(
    useCallback(() => {
      fetchEvents();
      getType();
      getEventDetails();
      UpcomingEventsforNGO();
    }, [selectedTab])
  );

  return (
    <SafeAreaView style={{ backgroundColor: "#20a963" }}>
      {/* <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}> */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === "past" && styles.activeTab]}
          onPress={() => setSelectedTab("past")}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === "past" && styles.activeTabText,
            ]}
          >
            Past Events
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === "upcoming" && styles.activeTab]}
          onPress={() => {
            setSelectedTab("upcoming");
            fetchEvents();
          }}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === "upcoming" && styles.activeTabText,
            ]}
          >
            Upcoming Events
          </Text>
        </TouchableOpacity>
      </View>
      {selectedTab === "past" ? <PastEvents /> : <UpcomingEvents />}

      {userType !== "ngo" ? (
        <TouchableOpacity
          style={styles.plusIcon}
          onPress={() => {
            setModalVisible(true);
          }}
        >
          <Icon name="plus" size={24} color="#fff" />
        </TouchableOpacity>
      ) : (
        <></>
      )}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>
        <View style={styles.modalContent}>
          {/* Modal's inner content goes here */}

          {/* Non-scrollable "Add Event" section */}
          <View style={styles.addEventSection}>
            <TouchableOpacity
              style={styles.attractiveButton}
              onPress={() => handleButtonPress()}
            >
              <Text style={styles.buttonText}>Create New Event</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.editEventsSection}>
            <Text style={styles.sectionTitle}>Edit Upcoming Events</Text>
            {ngoEventDetails != "" ? (
              <UpcomingEventsforNGO />
            ) : (
              <Text>No events for this NGO </Text>
            )}
          </View>
          {/* </ScrollView> */}
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffff",
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "#20a963",
    paddingVertical: RFValue(5),
  },
  tab: {
    flex: 1,
    alignItems: "center",
    marginHorizontal: RFValue(5),
    paddingVertical: RFValue(8),
  },
  activeTab: {
    borderBottomWidth: RFValue(1.5),
    borderBottomColor: "#fff",
  },
  tabText: {
    color: "#fff",
    fontSize: RFValue(12),
  },
  activeTabText: {
    fontWeight: "bold",
  },
  // content: {
  //   alignItems: "flex-start",
  //   flex: 1,
  //   // justifyContent: 'center',
  //   // alignItems: 'center',
  // },
  editTrashIcon: {
    position: "relative",
    flexDirection: "row",
    elevation: 5,
    zIndex: 999,
    top: RFValue(40),
    left: RFValue(230),
  },
  description: {
    fontSize: RFValue(10.5),
    marginBottom: RFValue(5),
  },
  event_venue: {
    fontSize: RFValue(12),
    marginBottom: RFValue(5),
  },
  timing: {
    fontSize: RFValue(12),
    marginBottom: RFValue(5),
  },
  dateHeader: {
    fontSize: RFValue(12),
    fontWeight: "bold",
    marginVertical: RFValue(8),
    marginHorizontal: RFValue(8),
  },

  plusIcon: {
    position: "absolute",
    right: RFValue(20),
    bottom: RFValue(10),
    backgroundColor: "#20a963",
    width: 56, // Diameter of the circle
    height: 56, // Diameter of the circle
    borderRadius: 28, // Half the diameter to make it a perfect circle
    justifyContent: "center",
    alignItems: "center",
    elevation: 4, // Shadow for Android
    shadowColor: "#000", // Shadow for iOS
    shadowOffset: { width: 0, height: 2 }, // Shadow for iOS
    shadowOpacity: 0.1, // Shadow for iOS
    shadowRadius: 2, // Shadow for iOS
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: "80%",
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    // Add shadow or elevation if needed
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  addEventSection: {
    // Style for the "Add Event" section
  },
  editEventsScrollSection: {
    // Style for the scrollable section, if needed
  },
  editEventsSection: {
    // Style for the content inside the scrollable section
  },
  sectionTitle: {
    fontSize: RFValue(16),
    fontWeight: "bold",
    marginBottom: 10,
  },
  editDeleteIcons: {
    position: "relative",
    elevation: 5,
    zIndex: 999,
    top: RFValue(25),
    right: RFValue(15),
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  attractiveButton: {
    backgroundColor: "#20a963", // Bootstrap primary button color
    paddingVertical: RFValue(10),
    paddingHorizontal: RFValue(20),
    borderRadius: RFValue(8),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
    marginBottom: RFValue(15),
  },
  buttonText: {
    color: "#ffffff",
    fontSize: RFValue(14),
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default MyEvents;
