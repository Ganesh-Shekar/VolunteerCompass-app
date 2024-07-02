import React, { useState, useCallback, useEffect } from "react";
import { View, Text } from "react-native";
import { Agenda } from "react-native-calendars";
import { calendarTheme } from "react-native-calendars"; // Import the default calendar theme
import { Card, Avatar } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAllEventsVolunteeredByUser } from "../../backend/getApiRequests";
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

const MyEvents = () => {
  const [items, setItems] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchEvents = useCallback(async () => {
    try {
      const data = await AsyncStorage.getItem("token");
      if (data) {
        const response = await getAllEventsVolunteeredByUser(data);
        setItems(response);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchEvents();
    }, [fetchEvents])
  );

  const customTheme = {
    ...calendarTheme, // Merge with default calendar theme
    agendaDayTextColor:"black", // Custom color for agenda day text
    agendaDayNumColor: "black", // Custom color for agenda day number
    agendaTodayColor: "black", // Custom color for today's agenda
    agendaKnobColor: "black", // Custom color for the agenda knob
    agendaDayNumColor: "green", // Custom color for agenda day number
   
    
  };

  const renderItem = useCallback((item) => <EventItem item={item} />, []);

  const EventItem = React.memo(({ item }) => (
    <View
      style={{
        marginVertical: 10,
        marginTop: 30,
        backgroundColor: "#20a963",
        marginHorizontal: 10,
        padding: 10,
        borderRadius: 10,
      }}
    >
      <Text style={{ fontWeight: "bold", fontSize: 18, paddingBottom: 5 }}>
        {item.name}
      </Text>
      <Text>
        {item.description}
        {"\n"}
      </Text>
      <Text>
        {item.event_venue}
        {"\n"}
      </Text>
      <Text>{item.timing}</Text>
    </View>
  ));

  const loadItemsForMonth = useCallback(
    (day) => {
      setTimeout(() => {
        const newItems = {
          ...items,
          [day.dateString]: items[day.dateString] || [],
        };
        setItems(newItems);
      }, 1000);
    },
    [items]
  );

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1}}>
      <Agenda
        items={items}
        showOnlySelectedDayItems={true}
        theme={customTheme} // Apply custom theme
        renderItem={renderItem}
        loadItemsForMonth={loadItemsForMonth}
      />
    </View>
  );
};

export default MyEvents;
