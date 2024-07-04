import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAllEventsVolunteeredByUser } from "../../backend/getApiRequests";
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { boolean } from "yup";
import { RFValue } from "react-native-responsive-fontsize";

const MyEvents = () => {
  const [selectedTab, setSelectedTab] = useState("upcoming");
  const [eventsList, setEventsList] = useState([]);

  const fetchEvents = useCallback(async () => {
    try {
      const data = await AsyncStorage.getItem("token");
      if (data) {
        const response = await getAllEventsVolunteeredByUser(data);
        console.log(response);
        setEventsList(response);
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  const EventCard = ({ name, description, event_venue, timing }) => (
    <TouchableOpacity style={styles.card}>
      <Text style={styles.title}>{name}</Text>
      <Text style={styles.description}>{description}</Text>
      <Text style={styles.event_venue}>{event_venue}</Text>
      <Text style={styles.timing}>{timing}</Text>
    </TouchableOpacity>
  );

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

  const PastEvents = () => (
    <ScrollView>
      <View style={styles.content}>
        <View>
          {Object.entries(eventsList).map(
            ([date, events]) =>
              checkDate(date) && (
                <View key={date}>
                  <Text style={styles.dateHeader}>{date}</Text>

                  {events.map((event, index) => (
                    <EventCard key={index} {...event} />
                  ))}
                </View>
              )
          )}
        </View>
      </View>
    </ScrollView>
  );

  const UpcomingEvents = () => (
    <ScrollView>
      <View style={styles.content}>
        <View>
          {Object.entries(eventsList).map(
            ([date, events]) =>
              !checkDate(date) && (
                <View key={date}>
                  <Text style={styles.dateHeader}>{date}</Text>
                  {events.map((event, index) => (
                    <EventCard key={index} {...event} />
                  ))}
                </View>
              )
          )}
        </View>
      </View>
    </ScrollView>
  );

  useFocusEffect(
    useCallback(() => {
      fetchEvents();
    }, [fetchEvents])
  );

  return (
    <SafeAreaView style={styles.container}>
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
      {/* </SafeAreaView> */}
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
  content: {
    alignItems: "flex-start",
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
  },

  card: {
    backgroundColor: "#E0E7FF",
    borderRadius: 8,
    padding: RFValue(10),
    marginHorizontal: RFValue(6),
    marginBottom: RFValue(10),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: RFValue(6),
    elevation: 5,
  },
  title: {
    fontSize: RFValue(15),
    marginBottom: RFValue(5),
    fontWeight: "bold",
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
    marginVertical: RFValue(10),
    marginHorizontal: RFValue(10),
  },
});

export default MyEvents;
