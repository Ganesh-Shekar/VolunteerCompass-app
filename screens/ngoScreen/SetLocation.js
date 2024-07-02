import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Linking,
  Platform,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import * as Location from "expo-location";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { RFValue } from "react-native-responsive-fontsize";
import axios from "axios";

const { width, height } = Dimensions.get("window");
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.01;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const GOOGLE_PLACES_API_KEY = "AIzaSyCbD48T0Pl-bcxUa8mkuteYRWO094xcFOc";

const SetLocation = ({ address }) => {
  const geocodeAddress = async (address) => {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${GOOGLE_PLACES_API_KEY}`;

    try {
      const response = await axios.get(url);
      const { lat, lng } = response.data.results[0].geometry.location;
      return { latitude: lat, longitude: lng };
    } catch (error) {
      console.error("Geocoding error:", error);
      return null;
    }
  };

  const [region, setRegion] = useState({
    latitude: 28.627, // Default to Noida's approximate coordinates
    longitude: 77.3726,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  useEffect(() => {
    geocodeAddress(address).then((coords) => {
      if (coords) {
        setRegion({
          ...region,
          latitude: coords.latitude,
          longitude: coords.longitude,
        });
      }
    });
  }, []);

  const openInMaps = () => {
    const url = `http://maps.google.com/?q=${region.latitude},${region.longitude}`;
    Linking.openURL(url).catch((err) =>
      console.error("An error occurred", err)
    );
  };

  return (
    <View style={styles.container}>
      <Text
        style={{
          fontSize: RFValue(15),
          fontWeight: "600",
          marginBottom: 10,
          paddingHorizontal: RFValue(10),
        }}
      >
        NGO Location
      </Text>
      {/* <GooglePlacesAutocomplete
        placeholder="Search for a place"
        fetchDetails={true}
        onPress={(data, details = null) => {
          onPlaceSelected(data, details);
        }}
        query={{
          key: GOOGLE_PLACES_API_KEY,
          language: "en",
          components: "country:in",
        }}
        textInputProps={{
          value: address,
          onChangeText: (text) => setAddress(text),
        }}
        styles={styles.searchbar}
      /> */}
      <MapView style={styles.map} region={region}>
        <Marker
          coordinate={{
            latitude: region.latitude,
            longitude: region.longitude,
          }}
          draggable={true}
        />
      </MapView>
      <TouchableOpacity style={styles.button} onPress={openInMaps}>
        <Text style={styles.buttonText}>Open in Maps</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
  },
  map: {
    marginHorizontal: RFValue(10),
    flex: 1,
    // Shadow properties for iOS
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  button: {
    backgroundColor: "#20a963",
    padding: 10,
    margin: 20,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: RFValue(12),
  },
  //   searchbar: {
  //     container: {
  //       flex: 0,
  //     },
  //     textInputContainer: {
  //       borderColor: "black",
  //       borderRadius: 5,
  //       borderWidth: 1,
  //       backgroundColor: "white",
  //       marginBottom: 0,
  //     },
  //     textInput: {
  //       height: 38,
  //       color: "#5d5d5d",
  //       fontSize: 16,
  //     },
  //     predefinedPlacesDescription: {
  //       color: "#1faadb",
  //     },
  //   },
});

export default SetLocation;
