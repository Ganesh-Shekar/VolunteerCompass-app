import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  Dimensions,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import * as yup from "yup";
import { useFocusEffect } from "@react-navigation/native";
import { Formik } from "formik";
import DateTimePicker from "@react-native-community/datetimepicker";
import BackButton from "../../components/backButton";
const { width } = Dimensions.get("window");
import { addNgoEvent, updateNgoEvent } from "../../backend/getApiRequests";
import { RFValue } from "react-native-responsive-fontsize";
import { useRoute } from "@react-navigation/native";

const eventCreationValidationSchema = yup.object().shape({
  title: yup
    .string()
    .min(3, "Title is too short")
    .max(20, "Title is too long")
    .required("Title is required"),

  description: yup
    .string()
    .min(3, "Description is too short")
    .max(80, "Description is too long")
    .required("Description is required"),

  start_date: yup.date().required("Start Date is required"),
  start_time: yup.date().required("Start Time is required"),
  end_date: yup.date().required("End Date is required"),
  end_time: yup.date().required("End Time is required"),

  event_venue: yup
    .string()
    .min(2, "Event venue is too short")
    .max(15, "Venue is too long")
    .required("Venue is required"),

  event_requirements: yup
    .string()
    .min(2, "Requirement is too short")
    .max(30, "Requirement is too long")
    .required("Requirements are required"),

  volunteer_limit: yup.number().required("Volunteer count is required"),
});

const CreateEditEvent = ({ navigation }) => {
  const route = useRoute();
  const { event_details } = route.params;

  const [formKey, setFormKey] = useState(0);

  useFocusEffect(
    useCallback(() => {
      setFormKey((prevKey) => prevKey + 1);
    }, [])
  );

  const createEvent = async (values) => {
    const response = await addNgoEvent(values);
    if (response === "Success") {
      Alert.alert("Event Created Successfully");
      navigation.navigate("MyEvents");
    } else {
      throw new Error("Event Creation Failed");
    }
  };

  const updateEvent = async (values) => {
    const response = await updateNgoEvent(values);
    if (response === "Success") {
      Alert.alert("Event Updated Successfully");
      navigation.navigate("MyEvents");
    } else {
      throw new Error("Event Upadation Failed");
    }
  };

  const [eventInitialValues, setEventInitialValues] = useState({
    title: "",
    description: "",
    start_date: new Date(),
    end_date: new Date(),
    start_time: new Date(),
    end_time: new Date(),
    event_venue: "",
    event_requirements: "",
    volunteer_limit: "",
  });

  const [startDate, setStartDate] = useState(new Date());
  const [startTime, setStartTime] = useState(
    new Date(new Date().getTime() + 15 * 60000)
  );
  const [endDate, setEndDate] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());

  useEffect(() => {
    if (event_details) {
      setEventInitialValues({
        title: event_details.title,
        description: event_details.description,
        start_date: new Date(event_details.start_date),
        end_date: new Date(event_details.end_date),
        start_time: new Date(event_details.start_time),
        end_time: new Date(event_details.end_time),
        event_venue: event_details.event_venue,
        event_requirements: event_details.event_requirements,
        volunteer_limit: event_details.volunteer_limit,
      });

      function parseTimeString(timeString) {
        const parts = timeString.split(":");
        const date = new Date();
        date.setHours(
          parseInt(parts[0], 10),
          parseInt(parts[1], 10),
          parseInt(parts[2], 10)
        );
        return date;
      }

      const startTime = parseTimeString(event_details.start_time);
      const endTime = parseTimeString(event_details.end_time);

      setStartTime(startTime);
      setEndTime(endTime);
      setStartDate(new Date(event_details.start_date));
      setEndDate(new Date(event_details.end_date));
    }
  }, [event_details]);

  //to set minimum end time if start date and end dates are same
  const getMinimumDate = () => {
    return event_details === undefined &&
      startDate.getTime() === endDate.getTime()
      ? new Date(startTime.getTime() + 15 * 60000)
      : null;
  };

  return (
    <SafeAreaView>
       <BackButton/> 
      <View
        style={{ backgroundColor: "white", alignItems: "center" }}
        className={"h-full w-full"}
      >
        <Text style={{ fontSize: RFValue(13), marginTop: RFValue(5) }}>
          Event Details
        </Text>
        <ScrollView automaticallyAdjustKeyboardInsets={true}>
          <Formik
            key={formKey}
            initialValues={eventInitialValues}
            validationSchema={eventCreationValidationSchema}
            onSubmit={(values) => {
              function formatTime(date) {
                const timestamp = date;
                const newDate = new Date(timestamp);
                return newDate.toLocaleString("en-US", {
                  timeZone: "Asia/Kolkata",
                  hour12: false,
                  hour: "2-digit",
                  minute: "2-digit",
                });
              }

              values.start_time = formatTime(values.start_time);
              values.end_time = formatTime(values.end_time);

              values.ngo_id = "774dc6a1-9a43-41af-8f81-82031061f54c";

              if (event_details !== undefined) {
                values.event_id = "3f4b299a-75c2-43bd-8a91-5cdeda3b6d23";
                updateEvent(values);
                console.log(values);
              } else {
                createEvent(values);
                console.log(values);
              }
            }}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              setFieldValue,
            }) => (
              <View className="flex items-center mx-4 space-y-4 my-9">
                {/* Event Title */}
                <View
                  className="bg-black/5 p-3 rounded-2xl w-full"
                  style={{
                    width: width < 450 ? "100%" : 600,
                  }}
                >
                  <TextInput
                    placeholder="Event Title"
                    placeholderTextColor={"gray"}
                    value={values.title}
                    onChangeText={handleChange("title")}
                    onBlur={handleBlur("title")}
                    style={{ fontSize: RFValue(13) }}
                  />
                  {touched.title && errors.title && (
                    <Text style={styles.errorTxt}>{errors.title}</Text>
                  )}
                </View>
                {/* Event Description */}
                <View
                  className="bg-black/5 p-4 rounded-2xl w-full"
                  style={{
                    width: width < 450 ? "100%" : 600,
                  }}
                >
                  <TextInput
                    placeholder="Event Description"
                    placeholderTextColor={"gray"}
                    value={values.description}
                    onChangeText={handleChange("description")}
                    onBlur={handleBlur("description")}
                    style={{ fontSize: RFValue(13) }}
                  />
                  {touched.description && errors.description && (
                    <Text style={styles.errorTxt}>{errors.description}</Text>
                  )}
                </View>
                <View
                  className="bg-black/5 p-3 rounded-2xl w-full"
                  style={{
                    width: width < 450 ? "100%" : 600,
                  }}
                >
                  <TextInput
                    placeholder="Event Venue"
                    placeholderTextColor={"gray"}
                    value={values.event_venue}
                    onChangeText={handleChange("event_venue")}
                    onBlur={handleBlur("event_venue")}
                    style={{ fontSize: RFValue(13) }}
                  />

                  {touched.event_venue && errors.event_venue && (
                    <Text style={styles.errorTxt}>{errors.event_venue}</Text>
                  )}
                </View>

                {/* For Start Date */}
                <View style={{ flexDirection: "row" }}>
                  <View
                    className="bg-black/5 p-3 rounded-2xl"
                    style={{
                      width: width < 450 ? "48%" : 600,
                    }}
                  >
                    <TextInput
                      placeholderTextColor={"gray"}
                      placeholder="Start Date"
                      editable={false}
                    />

                    <View
                      style={{
                        flex: 1,
                        flexDirection: "row",
                        justifyContent: "center",
                      }}
                    >
                      <DateTimePicker
                        mode="date"
                        value={startDate}
                        onChange={(e, date) => {
                          setStartDate(date);
                          setFieldValue(
                            "start_date",
                            date.toISOString().split("T")[0]
                          );
                        }}
                        minimumDate={new Date()}
                      />
                    </View>

                    {touched.start_date && errors.start_date && (
                      <Text style={styles.errorTxt}>{errors.start_date}</Text>
                    )}
                  </View>

                  {/* For Start Time */}
                  <View
                    className="bg-black/5 p-3 rounded-2xl"
                    style={{
                      width: width < 450 ? "48%" : 600,
                      marginLeft: RFValue(8),
                    }}
                  >
                    <TextInput
                      placeholderTextColor={"gray"}
                      placeholder="Start Time"
                      editable={false}
                    />
                    <View
                      style={{
                        flex: 1,
                        flexDirection: "row",
                        justifyContent: "center",
                      }}
                    >
                      <DateTimePicker
                        mode="time"
                        value={startTime}
                        is24Hour={true}
                        onChange={(e, date) => {
                          setStartTime(date);
                          setFieldValue("start_time", date);
                        }}
                        // minimumDate={
                        //   new Date(new Date().getTime() + 15 * 60000)
                        // }
                        minuteInterval={15}
                      />
                    </View>
                    {touched.start_time && errors.start_time && (
                      <Text style={styles.errorTxt}>{errors.start_time}</Text>
                    )}
                  </View>
                </View>

                {/* For End Date */}
                <View style={{ flexDirection: "row" }}>
                  <View
                    className="bg-black/5 p-3 rounded-2xl w-full"
                    style={{
                      width: width < 450 ? "48%" : 600,
                    }}
                  >
                    <TextInput
                      placeholderTextColor={"gray"}
                      placeholder="End Date"
                      editable={false}
                    />
                    <View
                      style={{
                        flex: 1,
                        flexDirection: "row",
                        justifyContent: "center",
                      }}
                    >
                      <DateTimePicker
                        mode="date"
                        // display="spinner"
                        value={endDate}
                        onChange={(e, date) => {
                          setEndDate(date);
                          setFieldValue(
                            "end_date",
                            date.toISOString().split("T")[0]
                          );
                        }}
                        minimumDate={startDate}
                      />
                    </View>

                    {touched.end_date && errors.end_date && (
                      <Text style={styles.errorTxt}>{errors.end_date}</Text>
                    )}
                  </View>

                  {/* For End Time */}
                  <View
                    className="bg-black/5 p-3 rounded-2xl w-full"
                    style={{
                      width: width < 450 ? "48%" : 600,
                      marginLeft: RFValue(8),
                    }}
                  >
                    <TextInput
                      placeholderTextColor={"gray"}
                      placeholder="End Time"
                      editable={false}
                    />
                    <View
                      style={{
                        flex: 1,
                        flexDirection: "row",
                        justifyContent: "center",
                      }}
                    >
                      <DateTimePicker
                        mode="time"
                        value={endTime}
                        is24Hour={true}
                        onChange={(e, date) => {
                          setEndTime(date);
                          setFieldValue("end_time", date);
                        }}
                        minimumDate={getMinimumDate()}
                        minuteInterval={15}
                      />
                    </View>

                    {touched.end_time && errors.end_time && (
                      <Text style={styles.errorTxt}>{errors.end_time}</Text>
                    )}
                  </View>
                </View>

                <View
                  className="bg-black/5 p-3 rounded-2xl w-full"
                  style={{
                    width: width < 450 ? "100%" : 600,
                  }}
                >
                  <TextInput
                    placeholder="Event Requirements"
                    placeholderTextColor={"gray"}
                    value={values.event_requirements}
                    onChangeText={handleChange("event_requirements")}
                    onBlur={handleBlur("event_requirements")}
                    style={{ fontSize: RFValue(13) }}
                  />
                  {touched.event_requirements && errors.event_requirements && (
                    <Text style={styles.errorTxt}>
                      {errors.event_requirements}
                    </Text>
                  )}
                </View>

                <View
                  className="bg-black/5 p-3 rounded-2xl w-full"
                  style={{
                    width: width < 450 ? "100%" : 600,
                  }}
                >
                  <TextInput
                    placeholder="Volunteer Limit"
                    placeholderTextColor={"gray"}
                    value={String(values.volunteer_limit)}
                    onChangeText={handleChange("volunteer_limit")}
                    onBlur={handleBlur("volunteer_limit")}
                    style={{ fontSize: RFValue(13) }}
                    keyboardType="numeric"
                  />
                  {touched.volunteer_limit && errors.volunteer_limit && (
                    <Text style={styles.errorTxt}>
                      {errors.volunteer_limit}
                    </Text>
                  )}
                </View>

                <TouchableOpacity
                  className="bg-[#20a963] p-3 rounded-full items-center mt-5"
                  style={{ width: width < 450 ? "100%" : 300 }}
                  onPress={handleSubmit}
                >
                  <Text
                    className="text-white text-center"
                    style={{ fontSize: RFValue(13) }}
                  >
                    {event_details ? "Update Event" : "Create Event"}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </Formik>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  errorTxt: {
    fontSize: RFValue(10),
    color: "red",
    marginTop: 5,
  },
});

export default CreateEditEvent;
