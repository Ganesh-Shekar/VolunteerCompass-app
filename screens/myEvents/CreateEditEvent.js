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

const CreateEditEvent = ({ navigation }) => {
  const [startDate, setStartDate] = useState(new Date());
  const [startTime, setStartTime] = useState(
    new Date(new Date().getTime() + 15 * 60000)
  );
  const [endDate, setEndDate] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const maxDescriptionLength = 200;
  const maxEventRequirementLength = 210;
  const [descriptionHeight, setDescriptionHeight] = useState(30);
  // Adjust this function to handle the content size change
  const handleDescriptionChange = (event) => {
    setDescriptionHeight(event.nativeEvent.contentSize.height);
  };

  const [eventInitialValues, setEventInitialValues] = useState({
    title: "",
    description: "",
    start_date: new Date(),
    end_date: new Date(),
    start_time: new Date(new Date().getTime() + 15 * 60000),
    end_time: new Date(),
    event_venue: "",
    event_requirements: "",
    volunteer_limit: "",
  });

  const eventCreationValidationSchema = yup.object().shape({
    title: yup
      .string()
      .min(3, "Title is too short")
      .max(20, "Title is too long")
      .required("Title is required"),

    description: yup
      .string()
      .min(3, "Description is too short")
      .max(
        maxDescriptionLength,
        `Description is too long. Maximum length is ${maxDescriptionLength} characters`
      )
      .required("Description is required"),

    start_date: yup.date().required("Start Date is required"),
    start_time: yup
      .date()
      .nullable()
      .typeError("Please select start time")
      .required("Start Time is required"),
    end_date: yup.date().required("End Date is required"),
    end_time: yup
      .date()
      .nullable()
      .typeError("Please select end time")
      .required("End Time is required"),

    event_venue: yup
      .string()
      .min(2, "Event venue is too short")
      .max(15, "Venue is too long")
      .required("Venue is required"),

    event_requirements: yup
      .string()
      .min(2, "Requirement is too short")
      .max(
        maxEventRequirementLength,
        `Event Requirement is too long. Maximum length is ${maxEventRequirementLength} characters`
      )
      .required("Requirements are required"),

    volunteer_limit: yup.number().required("Volunteer count is required"),
  });
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
        event_id: event_details.event_id,
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
      const start_Time = parseTimeString(event_details.start_time);
      const end_Time = parseTimeString(event_details.end_time);

      setStartTime(start_Time);
      setEndTime(end_Time);
      setStartDate(new Date(event_details.start_date));
      setEndDate(new Date(event_details.end_date));
    } else {
      setStartDate(new Date());
      setStartTime(new Date(new Date().getTime() + 15 * 60000));
      setEndDate(new Date());
      setEndTime(new Date());
      setEventInitialValues({
        title: "",
        description: "",
        start_date: startDate,
        end_date: endDate,
        start_time: startTime,
        end_time: endTime,
        event_venue: "",
        event_requirements: "",
        volunteer_limit: "",
      });
    }
  }, [event_details]);

  const getMinimumTime = () => {
    return startDate.getTime() === endDate.getTime()
      ? new Date(startTime.getTime() + 15 * 60000)
      : null;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <BackButton />
      <View style={styles.container}>
        <Text style={styles.headerText}>Event Details</Text>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
          automaticallyAdjustKeyboardInsets={true}
        >
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
                updateEvent(values);
              } else {
                createEvent(values);
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
              <View style={styles.formContainer}>
                <View style={styles.inputContainer}>
                  <TextInput
                    placeholder="Event Title"
                    placeholderTextColor="gray"
                    value={values.title}
                    onChangeText={handleChange("title")}
                    onBlur={handleBlur("title")}
                    style={styles.textInput}
                  />
                  {touched.title && errors.title && (
                    <Text style={styles.errorTxt}>{errors.title}</Text>
                  )}
                </View>
                <View style={styles.inputContainer}>
                  <TextInput
                    placeholder="Event Description"
                    placeholderTextColor="gray"
                    value={values.description}
                    onChangeText={handleChange("description")}
                    onBlur={handleBlur("description")}
                    multiline={true}
                    onContentSizeChange={(event) =>
                      handleDescriptionChange(event)
                    }
                    style={{
                      ...styles.textInput,
                      height: Math.max(40, descriptionHeight),
                    }}
                  />
                  {touched.description && errors.description && (
                    <Text style={styles.errorTxt}>{errors.description}</Text>
                  )}
                </View>
                <View style={styles.inputContainer}>
                  <TextInput
                    placeholder="Event Venue"
                    placeholderTextColor="gray"
                    value={values.event_venue}
                    onChangeText={handleChange("event_venue")}
                    onBlur={handleBlur("event_venue")}
                    style={styles.textInput}
                  />
                  {touched.event_venue && errors.event_venue && (
                    <Text style={styles.errorTxt}>{errors.event_venue}</Text>
                  )}
                </View>
                <View style={styles.dateTimeContainer}>
                  <View style={styles.dateTimePickerContainer}>
                    <TextInput
                      placeholderTextColor="gray"
                      placeholder="Start Date"
                      editable={false}
                    />
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
                    {touched.start_date && errors.start_date && (
                      <Text style={styles.errorTxt}>{errors.start_date}</Text>
                    )}
                  </View>
                  <View
                    style={[
                      styles.dateTimePickerContainer,
                      styles.timePickerContainer,
                    ]}
                  >
                    <TextInput
                      placeholderTextColor="gray"
                      placeholder="Start Time"
                      editable={false}
                    />
                    <DateTimePicker
                      mode="time"
                      value={startTime}
                      is24Hour={true}
                      onChange={(e, date) => {
                        setStartTime(date);
                        setFieldValue("start_time", date);
                        getMinimumTime();
                      }}
                      minuteInterval={15}
                    />
                    {touched.start_time && errors.start_time && (
                      <Text style={styles.errorTxt}>{errors.start_time}</Text>
                    )}
                  </View>
                </View>
                <View style={styles.dateTimeContainer}>
                  <View style={styles.dateTimePickerContainer}>
                    <TextInput
                      placeholderTextColor="gray"
                      placeholder="End Date"
                      editable={false}
                    />
                    <DateTimePicker
                      mode="date"
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
                    {touched.end_date && errors.end_date && (
                      <Text style={styles.errorTxt}>{errors.end_date}</Text>
                    )}
                  </View>
                  <View
                    style={[
                      styles.dateTimePickerContainer,
                      styles.timePickerContainer,
                    ]}
                  >
                    <TextInput
                      placeholderTextColor="gray"
                      placeholder="End Time"
                      editable={false}
                    />
                    <DateTimePicker
                      mode="time"
                      value={endTime}
                      is24Hour={true}
                      onChange={(e, date) => {
                        setEndTime(date);
                        setFieldValue("end_time", date);
                      }}
                      minimumDate={getMinimumTime()}
                      minuteInterval={15}
                    />
                    {touched.end_time && errors.end_time && (
                      <Text style={styles.errorTxt}>{errors.end_time}</Text>
                    )}
                  </View>
                </View>
                <View style={styles.inputContainer}>
                  <TextInput
                    placeholder="Event Requirements"
                    placeholderTextColor="gray"
                    value={values.event_requirements}
                    onChangeText={handleChange("event_requirements")}
                    onBlur={handleBlur("event_requirements")}
                    multiline={true}
                    onContentSizeChange={(event) =>
                      handleDescriptionChange(event)
                    }
                    style={styles.textInput}
                  />
                  {touched.event_requirements && errors.event_requirements && (
                    <Text style={styles.errorTxt}>
                      {errors.event_requirements}
                    </Text>
                  )}
                </View>
                <View style={styles.inputContainer}>
                  <TextInput
                    placeholder="Volunteer Limit"
                    placeholderTextColor="gray"
                    value={String(values.volunteer_limit)}
                    onChangeText={handleChange("volunteer_limit")}
                    onBlur={handleBlur("volunteer_limit")}
                    style={styles.textInput}
                    keyboardType="numeric"
                  />
                  {touched.volunteer_limit && errors.volunteer_limit && (
                    <Text style={styles.errorTxt}>
                      {errors.volunteer_limit}
                    </Text>
                  )}
                </View>
                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={handleSubmit}
                >
                  <Text style={styles.submitButtonText}>
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
  safeArea: {
    flex: 1,
    backgroundColor: "white",
  },
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: {
    fontSize: RFValue(18),
    marginTop: RFValue(5),
    fontWeight: "bold",
  },
  scrollView: {
    flex: 1,
    width: "100%",
  },
  scrollViewContent: {
    alignItems: "center",
    padding: RFValue(10),
  },
  formContainer: {
    width: "100%",
    maxWidth: 600,
    alignItems: "center",
  },
  inputContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    padding: RFValue(10),
    borderRadius: 16,
    width: "100%",
    marginBottom: RFValue(10),
  },
  textInput: {
    fontSize: RFValue(13),
  },
  dateTimeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: RFValue(10),
    width: "100%",
  },
  dateTimePickerContainer: {
    backgrounrdColor: "rgba(0, 0, 0, 0.05)",
    padding: RFValue(8),
    borderRadius: 16,
    width: "48%",
  },
  timePickerContainer: {
    marginLeft: RFValue(8),
  },
  errorTxt: {
    fontSize: RFValue(10),
    color: "red",
    marginTop: RFValue(3),
  },
  submitButton: {
    backgroundColor: "#20a963",
    padding: RFValue(12),
    borderRadius: 50,
    alignItems: "center",
    marginTop: RFValue(10),
    width: "100%",
    maxWidth: 300,
  },
  submitButtonText: {
    color: "white",
    textAlign: "center",
    fontSize: RFValue(13),
  },
});

export default CreateEditEvent;
