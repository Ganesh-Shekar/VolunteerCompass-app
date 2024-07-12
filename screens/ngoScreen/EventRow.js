import { View, Text, StyleSheet } from "react-native";
import React, { useEffect } from "react";
import VolunteerButton from "./volunteerButton";
import Icon from "react-native-vector-icons/FontAwesome6";
import { RFValue } from "react-native-responsive-fontsize";

export default function EventRow({
  event,
  saved_ngo,
  showVolunteerButton,
  showVolunteerLimit,
  showSlotsCount,
}) {
  useEffect(() => {}, [event, event.slots_left, event.volunteer_limit]);

  const event_start_date = formatDate(event.start_date);
  const event_end_date = formatDate(event.end_date);

  //function to convert date to required format
  function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: "numeric", month: "long", day: "numeric" };
    let formattedDate = date.toLocaleDateString("en-US", options);
    // Extract the day number to append the suffix
    const day = date.getDate();
    let suffix;
    switch (day) {
      case 1:
      case 21:
      case 31:
        suffix = "st";
        break;
      case 2:
      case 22:
        suffix = "nd";
        break;
      case 3:
      case 23:
        suffix = "rd";
        break;
      default:
        suffix = "th";
    }

    // Replace the day number with the day number + suffix
    formattedDate = formattedDate.replace(/\d+/, `${day}${suffix}`);
    return formattedDate;
  }

  event_start_time = event.start_time.split(":").slice(0, 2).join(":");
  event_end_time = event.end_time.split(":").slice(0, 2).join(":");
  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: "#e5e5e5",
        flexDirection: "row",
        alignItems: "center",
        marginTop: RFValue(10),
        backgroundColor: "#F8F8F8",
        padding: RFValue(12),
        borderRadius: RFValue(15),
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        marginHorizontal: RFValue(8),
      }}
    >
      <View style={{ flex: 1 }}>
        <View style={{ paddingLeft: RFValue(8) }}>
          <Text
            style={{
              fontSize: RFValue(15),
              marginHorizontal: RFValue(8),
              fontWeight: "bold",
            }}
          >
            {event.title}
          </Text>
          <Text
            style={{
              fontSize: RFValue(11),
              marginHorizontal: RFValue(8),
              marginTop: RFValue(6),
              fontWeight: "500",
            }}
          >
            {event.description}
          </Text>
          <Text
            style={{
              fontSize: RFValue(12),
              marginHorizontal: RFValue(8),
              marginTop: RFValue(10),
              fontWeight: "400",
            }}
          >
            <Icon name="calendar-day" size={19} /> {event_start_date} -{" "}
            {event_end_date}
          </Text>
          <Text
            style={{
              fontSize: RFValue(12),
              marginHorizontal: RFValue(8),
              marginTop: RFValue(10),
              fontWeight: "400",
            }}
          >
            <Icon name="location-dot" size={19} color="#f66" />{" "}
            {event.event_venue}
          </Text>
          <Text
            style={{
              fontSize: RFValue(12),
              marginHorizontal: RFValue(8),
              marginTop: RFValue(6),
              marginBottom: RFValue(6),
              fontWeight: "300",
            }}
          >
            <Icon name="clock" size={19} /> {event_start_time} -{" "}
            {event_end_time}
          </Text>
          {showVolunteerLimit && (
            <Text
              style={{
                fontSize: RFValue(12),
                marginHorizontal: RFValue(8),
                marginTop: RFValue(6),
                marginBottom: RFValue(6),
                fontWeight: "bold",
              }}
            >
              Volunteers Required : {event.volunteer_limit}
            </Text>
          )}
          {showSlotsCount && (
            <Text
              style={{
                fontSize: RFValue(12),
                marginHorizontal: RFValue(8),
                marginTop: RFValue(6),
                marginBottom: RFValue(6),
                fontWeight: "bold",
              }}
            >
              Slots Left : {event.slots_left}
            </Text>
          )}
          <Text
            style={{
              fontStyle: "italic",
              fontSize: RFValue(12),
              marginHorizontal: RFValue(8),
              marginTop: RFValue(6),
              fontWeight: "300",
            }}
          >
            {event.event_requirements}
          </Text>
        </View>
        {showVolunteerButton && (
          <View style={styles.buttonContainer}>
            <VolunteerButton event={event} saved_ngo={saved_ngo} />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: RFValue(10),
  },
});
