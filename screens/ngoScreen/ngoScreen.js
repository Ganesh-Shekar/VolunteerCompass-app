import { StatusBar } from "expo-status-bar";
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Dimensions,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { React, useState, useLayoutEffect, useEffect } from "react";
import { ChevronLeftIcon } from "react-native-heroicons/outline";
import BackButton from "../../components/backButton";
import EventRow from "./EventRow";
import { getNgoInfo, getAllEventsByNgoId } from "../../backend/getApiRequests";
import ngoimage from "../../assets/ngoimage.jpg";
import Icon from "react-native-vector-icons/FontAwesome6";
const { width, height } = Dimensions.get("window");
import { RFValue } from "react-native-responsive-fontsize";

// const dimensions = Dimensions.get("window").width

const NgoScreen = ({ route }) => {
  const ngoimage1 = Image.resolveAssetSource(ngoimage).uri;
  const navigation = useNavigation();

  const ngoData = route.params["ngoData"];
  const [ngoDetails, setNgoDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [eventDetails, setEventDetails] = useState([{}]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  async function getEventDetails() {
    try {
      const events_per_ngo = await getAllEventsByNgoId(ngoData.ngo_id);
      setEventDetails(events_per_ngo);
    } catch (error) {
      throw error;
    }
  }

  async function getNgoDetails() {
    try {
      const response = await getNgoInfo(ngoData.ngo_id);
      setNgoDetails(response);
      setLoading(false);
    } catch (err) {
      throw err;
    }
  }

  useEffect(() => {
    getNgoDetails();
    getEventDetails();
  }, []);

  const saved_ngo = ngoDetails;

  return (
    <SafeAreaView className="bg-white">
      {loading ? <Text>Loading</Text> : null}
      {ngoDetails &&
        ngoDetails.map((data) => (
          <ScrollView key={data.id}>
            <BackButton />
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Image source={{ uri: ngoimage1 }} style={styles.image} />
            </View>
            <View
              style={{
                paddingVertical: RFValue(20),
                paddingHorizontal: RFValue(20),
              }}
            >
              <Text
                style={{
                  flexShrink: 1,
                  fontSize: RFValue(19),
                  textAlign: "center",
                  fontFamily: "Open Sans",
                }}
              >
                {data.ngo_display_name}
              </Text>
              <Text
                style={{
                  fontSize: RFValue(14),
                  color: "gray",
                  textTransform: "capitalize",
                  fontWeight: 500,
                  textAlign: "center",
                }}
              >
                {data.category}
              </Text>

              <View style={styles.element}>
                <Text
                  style={{
                    ...styles.paragraph,
                    marginTop: RFValue(10),
                    color: "black",
                    marginBottom: RFValue(10),
                  }}
                >
                  {data.description}
                </Text>
              </View>
              <View
                style={{
                  ...styles.element,
                  flexDirection: "row",
                  marginBottom: RFValue(6),
                }}
              >
                {/* <Text style={styles.title}>Address</Text> */}
                <Icon name="location-dot" size={20} color="#f66" />
                <Text style={{ ...styles.paragraph, marginLeft: RFValue(5) }}>
                  {data.address}
                </Text>
              </View>

              {data.email != null || data.contact_phone != null ? (
                <View style={styles.element}>
                  {/* <Text style={styles.title}>Contact</Text> */}

                  {data.email != null ? (
                    <View
                      style={{ flexDirection: "row", marginBottom: RFValue(5) }}
                    >
                      <Icon name="envelope" size={20} color="black" />
                      <Text
                        style={{ ...styles.paragraph, marginLeft: RFValue(5) }}
                      >
                        Email: {data.contact_email}
                      </Text>
                    </View>
                  ) : null}
                  {data.contact_phone != null ? (
                    <View style={{ flexDirection: "row" }}>
                      <Icon name="phone" size={20} color="black" />
                      <Text
                        style={{ ...styles.paragraph, marginLeft: RFValue(5) }}
                      >
                        Phone: {data.contact_phone}
                      </Text>
                    </View>
                  ) : null}
                </View>
              ) : null}
            </View>
            <View className="bg-white" style={{ minHeight: 900 }}>
              <Text style={{ ...styles.title, paddingHorizontal: RFValue(20) }}>
                Events
              </Text>
              {eventDetails && eventDetails.length != 0 ? (
                eventDetails.map((event, index) => (
                  <View
                    style={{
                      shadowColor: "grey",
                      shadowOffset: {
                        width: 0,
                        height: RFValue(6),
                      },
                      shadowOpacity: 0.1,
                      shadowRadius: 0.5,
                    }}
                    key={index}
                  >
                    <EventRow
                      key={index}
                      event={event}
                      saved_ngo={ngoData.ngo_id}
                    />
                  </View>
                ))
              ) : (
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: RFValue(14),
                    marginTop: RFValue(10),
                    alignItems: "center",
                    margin: "auto",
                  }}
                >
                  No events for this NGO currently
                </Text>
              )}
            </View>
          </ScrollView>
        ))}

      <StatusBar style="auto" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    paddingTop: RFValue(5),
    fontSize: RFValue(15),
    fontWeight: "600",
  },
  element: {},
  paragraph: {
    alignItems: "center",
    fontSize: RFValue(13),
    marginTop: RFValue(2),
    color: "#0056b3",
  },
  image: {
    width: "100%",
    height: RFValue(150),
  },
});

export default NgoScreen;
