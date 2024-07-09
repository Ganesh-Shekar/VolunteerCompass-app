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
import {
  getNgoBasedOnCategory,
  getAllEventsByNgoId,
} from "../../backend/getApiRequests";
import { RFValue } from "react-native-responsive-fontsize";
//import { useFonts } from "expo-font";
import Icon from "react-native-vector-icons/MaterialIcons";

const HorizontalScrollable = ({ title, categoryId, data, city_value }) => {
  const image_num = 100;
  // const [loadedFonts] = useFonts({
  //   OpenSans: require("../../assets/fonts/Open Sans.ttf"),
  // });
  const [ngoDetails, setNgoDetails] = useState([]);
  const navigation = useNavigation();
  const handleImagePress = (ngoData) => {
    navigation.navigate("NgoPage", { ngoData });
  };

  async function getCategoryNgo(categoryId = null) {
    try {
      const response = await getNgoBasedOnCategory({ categoryId: categoryId });
      setNgoDetails(response);
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
          (ngo.city
            ? ngo.city.trim().toLowerCase() === city_value.trim().toLowerCase()
            : false)
        );
      }).length > 0 && (
        <Text
          style={{
            fontSize: RFValue(16),
            fontWeight: "bold",
            marginVertical: RFValue(12),
            marginLeft: RFValue(5),
          }}
        >
          {title}
        </Text>
      )}
      <SafeAreaView>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: RFValue(8), flexGrow: 1 }}
        >
          {ngoDetails
            .filter((ngo) => {
              return (
                ngo.category_id === categoryId &&
                (ngo.city
                  ? ngo.city.trim().toLowerCase() ===
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
                    {/* <View style={styles.numberContainer}>
                      <Icon
                        name="volunteer-activism"
                        size={20}
                        color="#167d48"
                      />
                      <Text style={styles.numberText}>{ngo.event_count}</Text>
                    </View> */}
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
    top: RFValue(8), // Adjust the position as needed
    right: RFValue(-58), // Adjust the position as needed
    backgroundColor: "white",
    opacity: 0.8,
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
