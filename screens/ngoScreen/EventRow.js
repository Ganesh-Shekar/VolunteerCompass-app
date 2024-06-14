import { View, Text, Image, StyleSheet, Button, Modal } from "react-native";
import React, { useEffect, useState } from "react";
import VolunteerButton from "./volunteerButton";
import getAllEventsByNgoId from "../../backend/getApiRequests";
import Icon from "react-native-vector-icons/FontAwesome6";

export default function EventRow({ event, saved_ngo }) {
  // const [eventDetails, setEventDetails] = useState([])

  // async function getEvents(ngoId){
  //     try {
  //         const response = await getAllEventsByNgoId({ngoId:ngoId});
  //         setEventDetails(response)
  //         console.log(eventDetails)
  //     } catch (error) {
  //         console.error(error);
  //         throw error;
  //     }
  // }

  useEffect(() => {
    // getEvents()
  }, [event]);

  return (
    // {eventDetails.map((eventData) => (
    <View
      className="flex-row items-center bg-white p-3 rounded-3xl shadow-xl  mb-3 mx-2"
      style={{
        borderWidth: 1,
        flexDirection: "row",
        alignItems: "center",
        marginTop: 10,
      }}
    >
      <View className="flex felx-1 space-y-3">
        <View className="pl-3">
          <Text
            style={{ fontSize: 20, marginHorizontal: 10, fontWeight: "bold" }}
          >
            {event.title}
          </Text>
          <Text
            style={{
              fontSize: 17,
              marginHorizontal: 10,
              marginTop: 10,
              fontWeight: 500,
            }}
          >
            {event.description}
          </Text>
          <Text
            style={{
              fontSize: 16,
              marginHorizontal: 10,
              marginTop: 10,
              fontWeight: 400,
            }}
          >
            <Icon name="location-dot" size={19} /> <> </>
            {event.event_venue}
          </Text>
          <Text
            style={{
              fontSize: 15,
              marginHorizontal: 10,
              marginTop: 10,
              fontWeight: 300,
            }}
          >
            <Icon name="clock" size={19} /> <> </>
            {event.timing}
          </Text>
          <Text
            style={{
              fontStyle: "italic",
              fontSize: 15,
              marginHorizontal: 10,
              marginTop: 10,
              fontWeight: 300,
            }}
          >
            {event.event_requirements}
          </Text>
        </View>
        <View
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <VolunteerButton event={event} saved_ngo={saved_ngo} />
        </View>
      </View>
    </View>
    // ))}
  );
}
