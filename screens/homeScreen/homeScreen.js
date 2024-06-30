import { StatusBar } from "expo-status-bar";
import React, { useLayoutEffect, useState, useEffect } from "react";
import {
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Modal,
  Button,
  Alert,
} from "react-native";
import HorizontalScrollable from "./horizontalScrollable";
import InfoIcon from "./infoIcon";
import AccountIcon from "./accountIcon";
import { getNgoNames, getCityResults } from "../../backend/getApiRequests";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome5";
import { SearchBar } from "@rneui/themed";
import { RFValue } from "react-native-responsive-fontsize";
import * as Location from "expo-location";

const { width } = Dimensions.get("window");

const HomeScreen = () => {
  const dropdown_data = [
    { key: "Bengaluru-1", name: "Bengaluru" },
    { key: "Delhi-2", name: "Delhi" },
    { key: "Mumbai-3", name: "Mumbai" },
    { key: "San Francisco-4", name: "San Francisco" },
  ];
  const [showModal, setShowModal] = useState(false);
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const isSearchBarEmpty = searchQuery === "";
  const [value, setValue] = useState("Bengaluru");
  const [searchText, setSearchText] = useState("");
  const [predictions, setPredictions] = useState(dropdown_data);
  const [locationServiceEnabled, setLocationServiceEnabled] = useState(false);
  const [displayCurrentAddress, setDisplayCurrentAddress] = useState(
    "Wait, we are fetching your location..."
  );

  async function fetchPredictions(text) {
    setSearchText(text); // Ensure state is updated here
    if (text) {
      try {
        const response = await getCityResults(text);
        let tempPredicts = response.predictions.map((prediction) => ({
          key: `${prediction.description.split(",")[0]}-${prediction.place_id}`,
          name: prediction.description.split(",")[0],
        }));
        setPredictions(tempPredicts);
      } catch (error) {
        console.error("Error fetching predictions:", error);
      }
    } else {
      setPredictions(dropdown_data);
    }
  }

  const handleSearch = (text) => {
    setSearchQuery(text);
    if (text) {
      getNgoSearchResult(text)
        .then((result) => {
          // console.log(result);
          setSearchResults(result);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    } else {
      setSearchResults([]);
    }
  };

  async function getNgoSearchResult(text) {
    try {
      const response = await getNgoNames(text);
      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  const CheckIfLocationEnabled = async () => {
    let enabled = await Location.hasServicesEnabledAsync();
    if (!enabled) {
      Alert.alert(
        "Location Service not enabled",
        "Please enable your location services to continue",
        [{ text: "OK" }],
        { cancelable: false }
      );
    } else {
      setLocationServiceEnabled(enabled);
    }
  };

  const GetCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission not granted",
        "Allow the app to use location service.",
        [{ text: "OK" }],
        { cancelable: false }
      );
    }

    let { coords } = await Location.getCurrentPositionAsync();

    if (coords) {
      const { latitude, longitude } = coords;
      let response = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      for (let item of response) {
        let address = `${item.city}`;
        setDisplayCurrentAddress(address);
      }
    }
  };

  useEffect(() => {
    CheckIfLocationEnabled();
    GetCurrentLocation();
  }, []);

  useEffect(() => {
    if (searchText.length === 0) {
      setPredictions(dropdown_data);
    }
  }, [searchText]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const horizontalScrollables = [
    {
      title: "Education",
      categoryId: "9df336bb-5c14-4039-a5b6-cb30d58f9a61",
    },
    {
      title: "Animal Shelter",
      categoryId: "34dd4a16-8dfa-422e-9ff2-a57e06394701",
    },
    {
      title: "Elderly Care",
      categoryId: "0e5bef92-3516-45f9-a223-aaf57aa6e9a1",
    },
    {
      title: "Health Care",
      categoryId: "add7a628-16e5-4c8f-9e62-6e5955b9ea7d",
    },
  ];

  return (
    <SafeAreaView
      className={"bg-white pt-5 h-full"}
      style={{ backgroundColor: "#20a963" }}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: "gray" }}>
        <View style={{ backgroundColor: "#20a963", paddingTop: RFValue(10) }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View className="flex-row flex-1">
              <Icon
                name="location-arrow"
                size={RFValue(16)}
                color="black"
                style={{ padding: RFValue(7) }}
              />
              <View style={{ marginTop: RFValue(7) }}>
                <Modal
                  transparent={true}
                  visible={showModal}
                  animationType="slide"
                >
                  <View style={styles.centerView}>
                    <View style={styles.modalView}>
                      {/* Search Bar Section */}
                      <View style={styles.searchCitybar}>
                        <SearchBar
                          placeholder="Search for city..."
                          searchIcon={{ size: RFValue(18) }}
                          clearIcon={{ size: RFValue(18) }}
                          inputStyle={{ color: "black", fontSize: RFValue(13) }}
                          onChangeText={fetchPredictions}
                          value={searchText}
                          lightTheme={true}
                          round={true}
                          containerStyle={{
                            backgroundColor: "none",
                            borderTopWidth: 0,
                            borderBottomWidth: 0,
                          }}
                          inputContainerStyle={{
                            backgroundColor: "#F5F5F5", // Grey background for search bar
                            borderBottomWidth: 0,
                            paddingVertical: width < 450 ? 0 : 10,
                          }}
                        />
                      </View>

                      {/* Cities Display Section */}
                      <View style={{ flex: 1, backgroundColor: "white" }}>
                        {searchText.length === 0 ? (
                          <View>
                            <Text
                              style={{
                                marginTop: RFValue(20),
                                fontSize: RFValue(14),
                              }}
                            >
                              POPULAR CITIES
                            </Text>
                            {predictions.map((item, index) => (
                              <View
                                key={item.key}
                                style={{ flexDirection: "column", flex: 1 }}
                              >
                                <TouchableOpacity
                                  onPress={() => {
                                    setShowModal(false);
                                    setValue(item.name);
                                  }}
                                  style={{
                                    flexDirection: "row",
                                    flex: 1,
                                    alignItems: "center",
                                  }}
                                >
                                  <Icon name="city" size={RFValue(15)} />
                                  <Text style={styles.locationTextStyle}>
                                    {item.name.toString()}
                                  </Text>
                                </TouchableOpacity>
                                {index < predictions.length - 1 && (
                                  <View
                                    style={{
                                      borderBottomColor: "black",
                                      borderBottomWidth:
                                        StyleSheet.hairlineWidth,
                                    }}
                                  />
                                )}
                              </View>
                            ))}
                          </View>
                        ) : (
                          <View>
                            {predictions.map((item, index) => (
                              <View
                                key={item.key}
                                style={{ flexDirection: "column", flex: 1 }}
                              >
                                <TouchableOpacity
                                  onPress={() => {
                                    setShowModal(false);
                                    setValue(item.name);
                                  }}
                                  style={{
                                    flexDirection: "row",
                                    flex: 1,
                                    alignItems: "center",
                                  }}
                                >
                                  <Icon name="city" size={RFValue(15)} />
                                  <Text style={styles.locationTextStyle}>
                                    {item.name.toString()}
                                  </Text>
                                </TouchableOpacity>
                                {index < predictions.length - 1 && (
                                  <View
                                    style={{
                                      borderBottomColor: "black",
                                      borderBottomWidth:
                                        StyleSheet.hairlineWidth,
                                    }}
                                  />
                                )}
                              </View>
                            ))}
                          </View>
                        )}
                      </View>

                      {/* Close Button */}
                      <TouchableOpacity
                        style={styles.closeButton}
                        onPress={() => setShowModal(false)}
                      >
                        <Text style={styles.closeButtonText}>Close</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </Modal>

                <TouchableOpacity
                  onPress={() => setShowModal(true)}
                  style={{ flexDirection: "row", alignItems: "center" }}
                >
                  <Text
                    style={{
                      fontSize: RFValue(16),
                      color: "black",
                      marginRight: 10,
                    }}
                  >
                    {value}
                  </Text>
                  <Icon name="chevron-down" size={RFValue(12)} color="black" />
                </TouchableOpacity>
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-end",
                paddingRight: RFValue(8),
              }}
            >
              <AccountIcon />
            </View>
          </View>

          {/*searchbar for NGOs*/}
          <View style={styles.searchContainer}>
            <SearchBar
              placeholder="Search for NGOs..."
              searchIcon={{ size: RFValue(18), color: "black" }}
              clearIcon={{ size: RFValue(18) }}
              inputStyle={{ color: "black", fontSize: RFValue(13) }}
              onChangeText={handleSearch}
              value={searchQuery}
              lightTheme={true}
              round={true}
              containerStyle={{
                backgroundColor: "#20a963",
                borderTopWidth: 0,
                borderBottomWidth: 0,
              }}
              inputContainerStyle={{
                backgroundColor: "#F5F5F5",
                borderBottomWidth: 0,
                paddingVertical: width < 450 ? 0 : 10,
              }}
            />
          </View>
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          alwaysBounceVertical={false}
        >
          <View style={{ flex: 1 }}>
            {!isSearchBarEmpty &&
            (!searchResults || searchResults.length === 0) ? (
              <Text
                style={{
                  textAlign: "center",
                  marginTop: RFValue(20),
                  fontSize: RFValue(18),
                }}
              >
                No result found
              </Text>
            ) : (
              <>
                {horizontalScrollables.map((item) => (
                  <View key={item.categoryId}>
                    <HorizontalScrollable
                      title={item.title}
                      categoryId={item.categoryId}
                      data={searchQuery ? searchResults : null}
                      isSearchBarEmpty={isSearchBarEmpty}
                      city_value={value}
                    />
                  </View>
                ))}
              </>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaView>
  );
};

//styling for the search bar
const styles = StyleSheet.create({
  searchContainer: {
    backgroundColor: "#20a963",
    paddingVertical: RFValue(5),
  },
  centerView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    alignItems: "center",
    backgroundColor: "white",
    // border: "1px solid #999",
    // borderWidth: 1,
    padding: RFValue(20),
    borderRadius: RFValue(18),
    shadowColor: "#D3D3D3",
    height: RFValue(400),
    width: RFValue(280),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: RFValue(3.84),
    elevation: 5,
  },
  searchCitybar: {
    width: RFValue(250),
    borderRadius: RFValue(10),
    border: "2px solid #999",

    // backgroundColor: "#20a963",
  },
  locationTextStyle: {
    fontSize: RFValue(14),
    width: RFValue(200),
    textAlign: "flex-start",
    paddingLeft: RFValue(10),
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#20a963",
    borderRadius: 5,
  },
  closeButtonText: {
    color: "white",
    fontSize: RFValue(13.5),
  },
});

export default HomeScreen;
