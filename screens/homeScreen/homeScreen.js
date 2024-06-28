import { StatusBar } from "expo-status-bar";
import { React, useLayoutEffect, useState, useEffect } from "react";
import {
  Text,
  View,
  SafeAreaView,
  Image,
  TextInput,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Animated,
  useWindowDimensions,
  StyleSheet,
  Dimensions,
  Modal,
  Button,
  FlatList,
} from "react-native";
import HorizontalScrollable from "./horizontalScrollable";
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
import InfoIcon from "./infoIcon";
// import AboutUs from './screens/AboutUs';
import AccountIcon from "./accountIcon";
// import Account from './screens/Account';
// import Third from './screens/Third';
// import SecondScreen from './screens/SecondScreen';

import { getNgoNames } from "../../backend/getApiRequests";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome5";
import { SearchBar } from "@rneui/themed";
import { RFValue } from "react-native-responsive-fontsize";
import { Dropdown } from "react-native-element-dropdown";
import * as Location from "expo-location";
import axios from "axios";
const { width, height } = Dimensions.get("window");
const GOOGLE_API_KEY = "AIzaSyCbD48T0Pl-bcxUa8mkuteYRWO094xcFOc";
const COUNTRY_CODE = "IN";

const HomeScreen = () => {
  // const dropdown_data = [
  //   { label: "Bengaluru", value: "bengaluru" },
  //   { label: "Delhi", value: "delhi" },
  //   { label: "Mumbai", value: "mumbai" },
  //   { label: "San Francisco", value: "san_fransisco" },
  // ];

  const dropdown_data = ["Bengaluru", "Delhi", "Mumbai", "San Francisco"];
  const [showModal, setShowModal] = useState(false);
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const isSearchBarEmpty = searchQuery === "";
  const [value, setValue] = useState("Bengaluru");
  const [isFocus, setIsFocus] = useState(false);
  // const [dropdownWidth, setDropdownWidth] = useState(100);
  const [searchText, setSearchText] = useState("");
  const [predictions, setPredictions] = useState([]);

  useEffect(() => {
    // Fetch cities from Google Places API based on user input
    if (searchText.length > 0) {
      fetchPredictions();
    } else {
      setPredictions([]);
    }
  }, []);

  // Function to fetch city predictions from Google Places API
  const fetchPredictions = async (text) => {
    try {
      setSearchText(text);
      console.log("Fetching predictions for:", searchText);
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${searchText}&language=en&types=(cities)&key=${GOOGLE_API_KEY}`,
        {
          params: {
            components: `country:${COUNTRY_CODE}`,
          },
        }
      );
      let tempPredicts = [];
      for (let i of response.data.predictions) {
        const firstWord = i.description.split(",")[0];
        tempPredicts.push({ key: `${firstWord}-${i.place_id}`, name: firstWord });
      }
      setPredictions(tempPredicts);
      console.log("Predictions:", predictions);
    } catch (error) {
      console.error("Error fetching predictions:", error);
    }
  };

  // Function to handle selecting a prediction
  // const handlePredictionSelect = async (placeId) => {
  //   try {
  //     const response = await axios.get(
  //       `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${GOOGLE_API_KEY}`
  //     );
  //     if (response.data.result) {
  //       console.log("Selected city:", response.data.result.formatted_address);
  //       // You can further process the selected city data here
  //     }
  //   } catch (error) {
  //     console.error("Error fetching place details:", error);
  //   }
  // };

  const [locationServiceEnabled, setLocationServiceEnabled] = useState(false);
  const [displayCurrentAddress, setDisplayCurrentAddress] = useState(
    "Wait, we are fetching you location..."
  );

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

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  const handleSearch = (text) => {
    setSearchQuery(text);
    if (text) {
      getNgoSearchResult(text)
        .then((result) => {
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
        console.log("Address: ", displayCurrentAddress);
      }
    }
  };

  useEffect(() => {
    CheckIfLocationEnabled();
    GetCurrentLocation();
    getNgoSearchResult();
    setValue(displayCurrentAddress);
    // const matchingOption = dropdown_data.find(
    //   (option) => option.label === displayCurrentAddress
    // );
    // setValue(matchingOption ? matchingOption.value : value);
  }, [displayCurrentAddress]);

  // useEffect(() => {
  //   const selectedOption = dropdown_data.find(
  //     (option) => option.value === value
  //   );
  //   if (selectedOption) {
  //     setDropdownWidth(selectedOption.label.length * 10 + 20);
  //   }
  // }, [value]);

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
    <SafeAreaView className={"bg-white pt-5 h-full"}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          // backgroundColor: "#20a963"
        }}
      >
        {/* <Image
            source={{
              uri: "https://picsum.photos/id/50/200/300",
            }}
            className="h-10 w-10 bg-gray-300 p-4 rounded-full"
          /> */}
        <View className="flex-row flex-1">
          <Icon
            name="location-arrow"
            size={RFValue(16)}
            color="#f66"
            style={{ padding: RFValue(7) }}
          />
          <View style={{ marginTop: RFValue(7) }}>
            {/* {renderLabel()} */}
            {/* <Dropdown
              style={[styles.dropdown]}
              itemTextStyle={{ fontSize: RFValue(12) }}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              data={dropdown_data}
              search
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder={!isFocus ? "Select city" : "..."}
              searchPlaceholder="Search city..."
              value={value}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              onChange={(item) => {
                setValue(item.value);
                setIsFocus(false);
              }}
            /> */}
            {/* SEARCH FOR CITIES */}
            <Modal transparent={true} visible={showModal} animationType="slide">
              <View style={styles.centerView}>
                <View style={styles.modalView}>
                  {/* <TextInput
                    style={styles.input}
                    // onChangeText={onChangeNumber}
                    value={value}
                    placeholder="useless placeholder"
                    keyboardType="numeric"
                  /> */}
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
                        backgroundColor: "#F5F5F5",
                        borderBottomWidth: 0,
                        paddingVertical: width < 450 ? 0 : 10,
                        // padding: RFValue(2),
                      }}
                    />
                  </View>
                  <View style={styles.citySearch}>
                    {searchText.length > 0 && (
                      <FlatList
                      data={predictions}
                      keyExtractor={(item) => item.key} 
                      renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => {setValue(item.name); setShowModal(false)}}>
                          <Text style={styles.cityText}>{item.name}</Text>
                        </TouchableOpacity>
                      )}
                    />
                    )}
                  </View>
                  <View>
                    {dropdown_data.map((item, index) => {
                      return (
                        <TouchableOpacity
                          onPress={() => {
                            setShowModal(false);
                            setValue(item);
                          }}
                        >
                          <Text style={styles.locationTextStyle}>{item}</Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>

                  <Button title="Close" onPress={() => setShowModal(false)} />
                </View>
              </View>
            </Modal>
            <TouchableOpacity
              onPress={() => setShowModal(true)}
              style={{ flexDirection: "row", alignItems: "center" }}
            >
              <Text style={{ fontSize: 20, color: "#dc3545", marginRight: 10 }}>
                {value}
              </Text>
              <Icon name="chevron-down" size={RFValue(12)} color="#f66" />
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
          {/* <InfoIcon /> */}
          <AccountIcon />
        </View>
      </View>

      {/*searchbar for NGOs*/}
      <View style={styles.searchContainer}>
        <SearchBar
          placeholder="Search for NGOs..."
          searchIcon={{ size: RFValue(18) }}
          clearIcon={{ size: RFValue(18) }}
          inputStyle={{ color: "black", fontSize: RFValue(13) }}
          onChangeText={handleSearch}
          value={searchQuery}
          lightTheme={true}
          round={true}
          containerStyle={{
            backgroundColor: "none",
            borderTopWidth: 0,
            borderBottomWidth: 0,
          }}
          inputContainerStyle={{
            backgroundColor: "#F5F5F5",
            borderBottomWidth: 0,
            paddingVertical: width < 450 ? 0 : 10,
            // padding: RFValue(2),
          }}
        />
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
              {horizontalScrollables.map((item, index) => (
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
  );
};

//styling for the search bar
const styles = StyleSheet.create({
  searchContainer: {
    backgroundColor: "white",
  },
  container: {
    backgroundColor: "black",
    padding: RFValue(10),
  },
  dropdown: {
    height: RFValue(20),
    borderColor: "transparent",
    borderWidth: 0,
    borderRadius: RFValue(8),
    // paddingHorizontal: RFValue(1),
  },
  icon: {
    marginRight: RFValue(10),
  },
  placeholderStyle: {
    fontSize: RFValue(12),
  },
  selectedTextStyle: {
    fontSize: RFValue(14),
  },
  inputSearchStyle: {
    height: RFValue(40),
    fontSize: RFValue(12),
  },
  centerView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    // justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e8e8e8",
    padding: 35,
    borderRadius: 20,
    shadowColour: "#D3D3D3",
    elevation: 5,
    height: RFValue(280),
    width: RFValue(280),
  },
  searchCitybar: {
    width: RFValue(200),
    height: RFValue(40),
    // padding: RFValue(10),
    // margin: RFValue(5),
    borderRadius: RFValue(10),
    backgroundColor: "#F5F5F5",
  },
  locationTextStyle: {
    fontSize: RFValue(16),
    padding: RFValue(10),
    borderBottomWidth: 1,
    borderBottomColor: "black",
    width: RFValue(200),
    textAlign: "center",
  },
  cityText: {
    fontSize: RFValue(15),
    margin: 5,
  },
  citySearch: {
    position: "absolute",
    top: RFValue(66.5),
    elevation: 5,
    zIndex: 999,
    width: RFValue(200),
    // height: RFValue(0),
    backgroundColor: "#F5F5F5",
    borderRadius: RFValue(10),
    padding: RFValue(10),
  },
});

export default HomeScreen;
