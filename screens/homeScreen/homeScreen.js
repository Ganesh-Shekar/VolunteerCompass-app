import { StatusBar } from "expo-status-bar";
import { React, useLayoutEffect, useRef, useState, useEffect } from "react";
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
import { getAllCategories } from "../../assets/constants/URLConstants";
import { getNgoNames } from "../../backend/getApiRequests";
import { getNgoBasedOnCategory } from "../../backend/getApiRequests";
import { useNavigation } from "@react-navigation/native";
import Autocomplete from "react-native-autocomplete-input";
import Icon from "react-native-vector-icons/FontAwesome";
import { SearchBar } from "@rneui/themed";
import { RFValue } from "react-native-responsive-fontsize";
import DropDownPicker from "react-native-dropdown-picker";
import { Dropdown } from "react-native-element-dropdown";
const { width, height } = Dimensions.get("window");

const data = [
  { label: "Bengaluru", value: "1" },
  { label: "Delhi", value: "2" },
  { label: "Mumbai", value: "3" },
];

const HomeScreen = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");
  const [ngoNames, setNgoNames] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const isSearchBarEmpty = searchQuery === "";

  const [value, setValue] = useState("1");
  const [isFocus, setIsFocus] = useState(false);

  const renderLabel = () => {
    if (value || isFocus) {
      return (
        <Text style={[styles.label, isFocus && { color: "blue" }]}>
          Dropdown label
        </Text>
      );
    }
    return null;
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

  useEffect(() => {
    getNgoSearchResult();
  }, []);

  return (
    <SafeAreaView className={"bg-white pt-5 h-full"}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        alwaysBounceVertical={false}
      >
        <StatusBar />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
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
              name="map-marker"
              size={RFValue(20)}
              color="#f66"
              style={{ padding: RFValue(10) }}
            />

            <View
              style={{ width: width < 450 ? 120 : 200, marginTop: RFValue(12) }}
            >
              {/* {renderLabel()} */}
              <Dropdown
                style={[styles.dropdown, isFocus && { borderColor: "blue" }]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={data}
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
              />
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-end",
              paddingRight: RFValue(8),
            }}
          >
            <InfoIcon />
            <AccountIcon />
          </View>
        </View>

        {/*searchbar for NGOs*/}
        <View style={styles.searchContainer}>
          {/* <Autocomplete
            data={ngoNames}
            defaultValue={searchQuery}
            onChangeText={handleSearch}
            placeholder="Search for NGOs..."
            listStyle={styles.list}
            flatListProps={{
              keyboardShouldPersistTaps: "always",
              keyExtractor: (item) => item.ngo_display_name,
              renderItem: ({ item }) => (
                <TouchableOpacity onPress={() => handleSelect(item)}>
                  <Text style={styles.itemText}>{item.ngo_display_name}</Text>
                </TouchableOpacity>
              ),
            }}
          /> */}
          <SearchBar
            placeholder="Search for NGOs..."
            searchIcon={{ size: RFValue(18) }}
            clearIcon={{ size: RFValue(18) }}
            inputStyle={{ color: "black", fontSize: RFValue(13) }}
            onChangeText={handleSearch}
            value={ngoNames}
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
              <HorizontalScrollable
                title={"Education"}
                categoryId="9df336bb-5c14-4039-a5b6-cb30d58f9a61"
                data={searchQuery ? searchResults : null}
                isSearchBarEmpty={isSearchBarEmpty}
              />
              <HorizontalScrollable
                title={"Animal Shelter"}
                categoryId="34dd4a16-8dfa-422e-9ff2-a57e06394701"
                data={searchQuery ? searchResults : null}
                isSearchBarEmpty={isSearchBarEmpty}
              />
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
    marginTop: RFValue(5),
    flex: 1,
    zIndex: 1,
  },
  container: {
    backgroundColor: "white",
    padding: RFValue(10),
  },
  dropdown: {
    height: RFValue(20),
    borderColor: "transparent",
    borderWidth: 0,
    borderRadius: RFValue(8),
    paddingHorizontal: RFValue(2),
  },
  icon: {
    marginRight: RFValue(10),
  },
  label: {
    position: "absolute",
    backgroundColor: "white",
    left: RFValue(22),
    top: RFValue(8),
    zIndex: 999,
    paddingHorizontal: RFValue(8),
    fontSize: RFValue(7),
  },
  placeholderStyle: {
    fontSize: RFValue(12),
  },
  selectedTextStyle: {
    fontSize: RFValue(14),
  },
  iconStyle: {
    width: RFValue(20),
    height: RFValue(20),
  },
  inputSearchStyle: {
    height: RFValue(40),
    fontSize: RFValue(12),
  },
});

export default HomeScreen;
