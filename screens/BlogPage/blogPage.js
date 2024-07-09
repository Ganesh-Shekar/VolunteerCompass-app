import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import React from "react";
import { RFValue } from "react-native-responsive-fontsize";

const BlogPage = () => {
  return (
    <SafeAreaView style={{ flex: 1, justifyContent: "center" }}>
      <View style={{ alignItems: "center" }}>
        <Text style={{ fontWeight: "bold", fontSize: RFValue(22) }}>
          Blog Page Coming Soon!!!
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  textStyle: {
    fontWeight: "bold",
  },
});

export default BlogPage;
