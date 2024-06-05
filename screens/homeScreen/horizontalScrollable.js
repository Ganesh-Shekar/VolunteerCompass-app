import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { getNgoBasedOnCategory } from "../../backend/getApiRequests";

const HorizontalScrollable = ({ title, categoryId, data }) => {
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
            fontSize: 20,
            fontWeight: "bold",
            marginVertical: 10,
            marginLeft: 10,
          }}
        >
          {title}
        </Text>
      )}
      <SafeAreaView className={"bg-white"}>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 10, flexGrow: 1 }}
        >
          {ngoDetails
            .filter((ngo) => ngo.category_id === categoryId)
            .map((ngo) => (
              <TouchableOpacity
                key={ngo.ngo_id}
                onPress={() => handleImagePress(ngo)}
              >
                <View style={{ marginHorizontal: 6 }}>
                  <Image
                    source={{ uri: "https://picsum.photos/200" }}
                    style={{ width: 150, height: 150, borderRadius: 50 }}
                  />
                  <Text style={{ textAlign: "center", marginTop: 5 }}>
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

export default HorizontalScrollable;
