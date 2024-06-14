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
} from "react-native";
import { HeartIcon, MagnifyingGlassIcon } from "react-native-heroicons/outline";
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

const HomeScreen = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");
  const [ngoNames, setNgoNames] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const isSearchBarEmpty = searchQuery === "";

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

  // const handleSelect = (fruit) => {
  //   setQuery(fruit.name);
  //   setFilteredFruits([]);
  // };

  return (
    <SafeAreaView className={"bg-white pt-5 h-full"}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        alwaysBounceVertical={false}
      >
        <StatusBar />
        <View className={"flex-row items-top mx-1 bg-white pt-2 px-2"}>
          <Image
            source={{
              uri: "https://picsum.photos/id/50/200/300",
            }}
            className="h-10 w-10 bg-gray-300 p-4 rounded-full"
          />
          <View className="flex-row flex-1">
            <Text
              className={"font-bold text-gray-700 text-2xl flex-1 px-3 mt-1"}
            >
              Volunteer Compass
            </Text>

            <InfoIcon />
            <AccountIcon />
          </View>
        </View>

        {/*searchbar for NGOs*/}
        <View style={styles.searchContainer}>
          <Autocomplete
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
          />
        </View>
        <View style={{ flex: 1 }}>
          {!isSearchBarEmpty &&
          (!searchResults || searchResults.length === 0) ? (
            <Text style={{ textAlign: "center", marginTop: 50, fontSize: 25 }}>
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
              <View style={styles.BottomText}>
              <Text className={"pt-10 mx-10 font-bold text-2xl content-center"}>
                No act of kindness,
              </Text>
              <Text className={"mx-9 font-bold text-2xl content-center"}>
                {" "}
                no matter how small,
              </Text>
              <Text className={"mx-10 font-bold text-3xl "}>
                is ever wasted!
              </Text>
              <TouchableOpacity>
                <HeartIcon
                  size={60}
                  style={{ marginTop: 10 }}
                />
              </TouchableOpacity>
              </View>
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
    shadowColor: "black",  
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.25, 
    shadowRadius: 3.84,
    elevation: 2,
    flex: 1,
    zIndex: 1,
    position: "relative",
    margin: 10,
    borderColor: "grey",
    borderWidth: 1,
    borderRadius: 3,
  },
  BottomText:{
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },
});

export default HomeScreen;
