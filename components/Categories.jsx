import { View, Text, FlatList, Image } from "react-native";
import React from "react";
import { hp, wp } from "../common/helper";

const Category = ({ source }) => {
  return (
    <View
      style={{
        backgroundColor: "rd",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "3.6%",
      }}
    >
      <Text style={{ marginBottom: "2%", fontWeight: 600, fontSize: 15 }}>
        Categories
      </Text>
      <FlatList
        data={source}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item, index }) => {
          return (
            <View
              style={{
                backgroundColor: "rd",
                justifyContent: "space-around",
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                width: wp(17),
              }}
            >
              <Image
                source={{ uri: item.Image }}
                style={{ height: hp(6), width: hp(6), borderRadius: 100 }}
              />
              {/* <Text>{item.Name}</Text> */}
            </View>
          );
        }}
      />
    </View>
  );
};

export default Category;
