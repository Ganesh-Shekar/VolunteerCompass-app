import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { getNgoBasedOnCategory, getAllEventsByNgoId } from "../../backend/getApiRequests";
import { RFValue } from "react-native-responsive-fontsize";
//import { useFonts } from "expo-font";
import Icon from "react-native-vector-icons/MaterialIcons";

const HorizontalScrollable = ({ title, categoryId, data, city_value }) => {
  const image_num = 100;
  // const [loadedFonts] = useFonts({
  //   OpenSans: require("../../assets/fonts/Open Sans.ttf"),
  // });
  const [ngoDetails, setNgoDetails] = useState([]);
  const [eventCount, setEventCount] = useState(0);
  const navigation = useNavigation();
  const handleImagePress = (ngoData) => {
    navigation.navigate("NgoPage", { ngoData });
  };

  async function getEventDetails() {
    try {
      const events_per_ngo = await getAllEventsByNgoId(ngoDetails.ngo_id);
      console.log(events_per_ngo);
    } catch (error) {
      throw error;
    }
  }

  async function getCategoryNgo(categoryId = null) {
    try {
      const response = await getNgoBasedOnCategory({ categoryId: categoryId });
      setNgoDetails(response);
      console.log(ngoDetails);
      await getEventDetails()
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  //if the search bar is empty, show all the NGOs
  useEffect(() => {
    if (data === null) {
      getCategoryNgo();
    } else if (data && data.length > 0) {
      setNgoDetails(data);
    }
  }, [data]);

  return (
    <View style={{ flex: 1 }}>
      {ngoDetails.filter((ngo) => {
        return (
          ngo.category_id === categoryId &&
          (ngo.address
            ? ngo.address.trim().toLowerCase() ===
              city_value.trim().toLowerCase()
            : false)
        );
      }).length > 0 && (
        <Text
          style={{
            fontSize: RFValue(16),
            fontWeight: "bold",
            marginVertical: RFValue(12),
            marginLeft: RFValue(12),
          }}
        >
          {title}
        </Text>
      )}
      <SafeAreaView className={"bg-white"}>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: RFValue(8), flexGrow: 1 }}
        >
          {ngoDetails
            .filter((ngo) => {
              return (
                ngo.category_id === categoryId &&
                (ngo.address
                  ? ngo.address.trim().toLowerCase() ===
                    city_value.trim().toLowerCase()
                  : false)
              );
            })
            .map((ngo, index) => (
              <TouchableOpacity
                key={ngo.ngo_id}
                onPress={() => handleImagePress(ngo)}
              >
                <View style={{ marginHorizontal: RFValue(6), width: "100%" }}>
                  <View style={styles.imageContainer}>
                    <Image
                      source={{
                        uri: `https://picsum.photos/${100 + index * 100}`,
                      }}
                      style={styles.image}
                    />
                    <View style={styles.numberContainer}>
                      <Icon
                        name="volunteer-activism"
                        size={20}
                        color="maroon"
                      />
                      <Text style={styles.numberText}>{eventCount}</Text>
                    </View>
                  </View>
                  <Text
                    style={{
                      textAlign: "center",
                      marginTop: RFValue(5),
                      fontSize: RFValue(14),
                      fontFamily: "OpenSans",
                      ellipsisoverflow: "hidden",
                      maxWidth: RFValue(120),
                    }}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {ngo.ngo_display_name}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: RFValue(120),
    height: RFValue(120),
    borderRadius: RFValue(10),
    margin: 5,
  },
  imageContainer: {
    width: "45%",
    shadowColor: "grey",
    shadowOffset: {
      width: 0,
      height: RFValue(3),
    },
    shadowOpacity: RFValue(0.65),
    shadowRadius: RFValue(3.84),
  },
  numberContainer: {
    position: "absolute",
    flexDirection: "row",
    top: 10, // Adjust the position as needed
    right: -80, // Adjust the position as needed
    backgroundColor: "white",
    padding: RFValue(4.5),
    borderRadius: RFValue(8),
  },
  numberText: {
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default HorizontalScrollable;
