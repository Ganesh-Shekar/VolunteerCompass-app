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
import { getNgoBasedOnCategory } from "../../backend/getApiRequests";
import { RFValue } from "react-native-responsive-fontsize";
//import { useFonts } from "expo-font";

const HorizontalScrollable = ({ title, categoryId, data }) => {
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
      {ngoDetails.filter((ngo) => ngo.category_id === categoryId).length >
        0 && (
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
            .filter((ngo) => ngo.category_id === categoryId)
            .map((ngo) => (
              <TouchableOpacity
                key={ngo.ngo_id}
                onPress={() => handleImagePress(ngo)}
              >
                <View style={{ marginHorizontal: RFValue(6), width: "100%" }}>
                  <View style={styles.imageContainer}>
                    <Image
                      source={{ uri: "https://picsum.photos/100" }}
                      style={styles.image}
                    />
                  </View>
                  <Text
                    style={{
                      textAlign: "center",
                      marginTop: RFValue(5),
                      fontSize: RFValue(12),
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
});

export default HorizontalScrollable;
