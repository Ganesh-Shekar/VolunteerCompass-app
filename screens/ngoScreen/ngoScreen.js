import { StatusBar } from "expo-status-bar";
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Dimensions,
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
import SetLocation from "./SetLocation";

const latitudeDelta = 0.025;
const longitudeDelta = 0.025;

const NgoScreen = ({ route }) => {
  const ngoimage1 = Image.resolveAssetSource(ngoimage).uri;
  const navigation = useNavigation();

  const ngoData = route.params["ngoData"];
  const [ngoDetails, setNgoDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [eventDetails, setEventDetails] = useState([]);

  const state = {
    region: {
      latitudeDelta,
      longitudeDelta,
      latitude: 12.840575,
      longitude: 77.651787,
    },
  };

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

  const renderNgoDetails = ({ item }) => (
    <View>
      <BackButton />
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Image source={{ uri: ngoimage1 }} style={styles.image} />
      </View>
      <View
        style={{ paddingVertical: RFValue(20), paddingHorizontal: RFValue(20) }}
      >
        <Text
          style={{
            flexShrink: 1,
            fontSize: RFValue(19),
            textAlign: "center",
            fontFamily: "Open Sans",
          }}
        >
          {item.ngo_display_name}
        </Text>
        <Text
          style={{
            fontSize: RFValue(14),
            color: "gray",
            textTransform: "capitalize",
            fontWeight: "500",
            textAlign: "center",
          }}
        >
          {item.category}
        </Text>
        <View style={{ marginStart: RFValue(15) }}>
          <Text
            style={{
              ...styles.paragraph,
              marginTop: RFValue(10),
              color: "black",
              marginBottom: RFValue(10),
            }}
          >
            {item.description}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            marginBottom: RFValue(6),
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
          }}
        >
          <Icon name="location-dot" size={RFValue(16)} color="#f66" />

          <Text
            style={{
              ...styles.paragraph,
              marginLeft: RFValue(5),
              alignContent: "center",
            }}
          >
            {item.address}
          </Text>
        </View>
        {item.email || item.contact_phone ? (
          <View style={styles.element}>
            {item.email ? (
              <View style={{ flexDirection: "row", marginBottom: RFValue(5) }}>
                <Icon name="envelope" size={RFValue(16)} color="black" />
                <Text style={{ ...styles.paragraph, marginLeft: RFValue(5) }}>
                  Email: {item.contact_email}
                </Text>
              </View>
            ) : null}
            {item.contact_phone ? (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Icon name="phone" size={RFValue(16)} color="black" />
                <Text style={{ ...styles.paragraph, marginLeft: RFValue(5) }}>
                  {item.contact_phone}
                </Text>
              </View>
            ) : null}
          </View>
        ) : null}
      </View>
    </View>
  );

  const renderEventDetails = ({ item, index }) => (
    <View
      style={{
        paddingBottom: RFValue(8),
        shadowColor: "grey",
        shadowOffset: { width: 0, height: RFValue(6) },
        shadowOpacity: 0.1,
        shadowRadius: 0.5,
      }}
      key={index}
    >
      <EventRow key={index} event={item} saved_ngo={ngoData.ngo_id} />
    </View>
  );

  return (
    <SafeAreaView className="bg-white">
      {loading && <Text>Loading</Text>}
      <FlatList
        data={ngoDetails}
        renderItem={renderNgoDetails}
        keyExtractor={(item) => item.id.toString()}
        ListFooterComponent={
          <>
            <Text style={{ ...styles.title, paddingHorizontal: RFValue(20) }}>
              Events
            </Text>
            {eventDetails.length > 0 ? (
              <FlatList
                data={eventDetails}
                renderItem={renderEventDetails}
                keyExtractor={(item, index) => index.toString()}
                ListFooterComponent={
                  ngoData.address ? (
                    <View
                      style={{
                        width: "100%",
                        height: 300,
                        marginTop: RFValue(20),
                      }}
                    >
                      <SetLocation address={ngoData.address} />
                    </View>
                  ) : (
                    <></>
                  )
                }
              />
            ) : (
              <>
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: RFValue(14),
                    marginTop: RFValue(10),
                    alignItems: "center",
                  }}
                >
                  No events for this NGO currently
                </Text>

                {ngoData.address ? (
                  <View
                    style={{
                      width: "100%",
                      height: 300,
                      marginTop: RFValue(20),
                    }}
                  >
                    <SetLocation address={ngoData.address} />
                  </View>
                ) : (
                  <></>
                )}
              </>
            )}
          </>
        }
      />
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
    fontSize: RFValue(13),
    color: "#0056b3",
  },
  image: {
    width: "100%",
    height: RFValue(150),
  },
});

export default NgoScreen;
