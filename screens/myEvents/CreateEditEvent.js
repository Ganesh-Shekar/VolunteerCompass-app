import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  Dimensions,
  TextInput,
  Platform,
  StyleSheet,
  Button,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import * as yup from "yup";
import { Formik } from "formik";
import DateTimePicker from "@react-native-community/datetimepicker";

const { width } = Dimensions.get("window");
import { RFValue } from "react-native-responsive-fontsize";

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

  start_date: yup.date().required("Date is required"),
  start_time: yup.date().required("Time is required"),
  end_date: yup.date().required("Date is required"),
  end_time: yup.date().required("Time is required"),

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
  const eventInitialValues = {
    title: "",
    description: "",
    start_date: "",
    end_date: "",
    start_time: "",
    end_time: "",
    event_venue: "",
    event_requirements: "",
    volunteer_limit: "",
  };

  const [startDate, setStartDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);

  const [endDate, setEndDate] = useState(new Date());
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  const handleDateChange = (selectedDate, setFieldValue, field) => {
    setShowStartDatePicker(false);
    setShowEndDatePicker(false);
    if (selectedDate) {
      setFieldValue(field, selectedDate);
    }
  };

  const handleTimeChange = (selectedTime, setFieldValue, field) => {
    setShowStartTimePicker(false);
    setShowEndTimePicker(false);
    if (selectedTime) {
      setFieldValue(field, selectedTime);
    }
  };

  return (
    <SafeAreaView>
      <View>
        <ScrollView>
          <Text>Enter Event Details Below</Text>
          <Formik
            initialValues={eventInitialValues}
            validationSchema={eventCreationValidationSchema}
            onSubmit={(values) => {
              console.log("Submitted Values: ", values);
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
                <View
                  className="bg-black/5 p-3 rounded-2xl w-full"
                  style={{
                    width: width < 450 ? "100%" : 600,
                  }}
                >
                  {!showStartDatePicker && (
                    <DateTimePicker
                      mode="date"
                      display="spinner"
                      value={startDate}
                      onChange={(event, selectedDate) =>
                        handleDateChange(selectedDate, setFieldValue, "start_date")
                      }
                      minimumDate={new Date()}
                    />
                  )}
                   {!showStartDatePicker && Platform.OS === "ios" && (
                    <View>
                      <Button title="Done" onPress={handleDateChange("",setFieldValue,'start_date')} />
                      <Button title="Close" onPress={setShowStartDatePicker(true)} />
                    </View>
                  )}
                  {!showStartDatePicker && (
                    <TouchableOpacity onPress={() => setShowStartDatePicker(true)}>
                      <TextInput
                        placeholder="Select Start Date"
                        placeholderTextColor={"gray"}
                        value={values.start_date ? values.start_date.toDateString() : ""}
                        onBlur={handleBlur("start_date")}
                        style={{ fontSize: RFValue(13) }}
                        editable={false}
                      />
                    </TouchableOpacity>
                  )}
                  {touched.start_date && errors.start_date && (
                    <Text style={styles.errorTxt}>{errors.start_date}</Text>
                  )}
                </View>

                {/* For Start Time */}
                <View
                  className="bg-black/5 p-3 rounded-2xl w-full"
                  style={{
                    width: width < 450 ? "100%" : 600,
                  }}
                >
                  {showStartTimePicker && (
                    <DateTimePicker
                      mode="time"
                      display="spinner"
                      value={startDate}
                      onChange={(event, selectedTime) =>
                        handleTimeChange(selectedTime, setFieldValue, "start_time")
                      }
                      is24Hour={true}
                    />
                  )}
                  {!showStartTimePicker && (
                    <TouchableOpacity onPress={() => setShowStartTimePicker(true)}>
                      <TextInput
                        placeholder="Select Start Time"
                        placeholderTextColor={"gray"}
                        value={values.start_time ? values.start_time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}
                        onBlur={handleBlur("start_time")}
                        style={{ fontSize: RFValue(13) }}
                        editable={false}
                      />
                    </TouchableOpacity>
                  )}
                  {touched.start_time && errors.start_time && (
                    <Text style={styles.errorTxt}>{errors.start_time}</Text>
                  )}
                </View>

                {/* For End Date */}
                <View
                  className="bg-black/5 p-3 rounded-2xl w-full"
                  style={{
                    width: width < 450 ? "100%" : 600,
                  }}
                >
                  {showEndDatePicker && (
                    <DateTimePicker
                      mode="date"
                      display="spinner"
                      value={endDate}
                      onChange={(event, selectedDate) =>
                        handleDateChange(selectedDate, setFieldValue, "end_date")
                      }
                      minimumDate={startDate}
                    />
                  )}
                  {!showEndDatePicker && (
                    <TouchableOpacity onPress={() => setShowEndDatePicker(true)}>
                      <TextInput
                        placeholder="Select End Date"
                        placeholderTextColor={"gray"}
                        value={values.end_date ? values.end_date.toDateString() : ""}
                        onBlur={handleBlur("end_date")}
                        style={{ fontSize: RFValue(13) }}
                        editable={false}
                      />
                    </TouchableOpacity>
                  )}
                  {touched.end_date && errors.end_date && (
                    <Text style={styles.errorTxt}>{errors.end_date}</Text>
                  )}
                </View>

                {/* For End Time */}
                <View
                  className="bg-black/5 p-3 rounded-2xl w-full"
                  style={{
                    width: width < 450 ? "100%" : 600,
                  }}
                >
                  {showEndTimePicker && (
                    <DateTimePicker
                      mode="time"
                      display="spinner"
                      value={endDate}
                      onChange={(event, selectedTime) =>
                        handleTimeChange(selectedTime, setFieldValue, "end_time")
                      }
                      is24Hour={true}
                    />
                  )}
                  {!showEndTimePicker && (
                    <TouchableOpacity onPress={() => setShowEndTimePicker(true)}>
                      <TextInput
                        placeholder="Select End Time"
                        placeholderTextColor={"gray"}
                        value={values.end_time ? values.end_time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}
                        onBlur={handleBlur("end_time")}
                        style={{ fontSize: RFValue(13) }}
                        editable={false}
                      />
                    </TouchableOpacity>
                  )}
                  {touched.end_time && errors.end_time && (
                    <Text style={styles.errorTxt}>{errors.end_time}</Text>
                  )}
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
                    <Text style={styles.errorTxt}>{errors.event_requirements}</Text>
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
                    value={values.volunteer_limit}
                    onChangeText={handleChange("volunteer_limit")}
                    onBlur={handleBlur("volunteer_limit")}
                    style={{ fontSize: RFValue(13) }}
                    keyboardType="numeric"
                  />
                  {touched.volunteer_limit && errors.volunteer_limit && (
                    <Text style={styles.errorTxt}>{errors.volunteer_limit}</Text>
                  )}
                </View>

                <TouchableOpacity
                  className="bg-[#F88379] p-3 rounded-full items-center mt-5"
                  style={{ width: width < 450 ? "100%" : 300 }}
                  onPress={handleSubmit}
                >
                  <Text
                    className="text-white text-center"
                    style={{ fontSize: RFValue(13) }}
                  >
                    Create Event
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


