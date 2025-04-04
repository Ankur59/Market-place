import { View, Text, Image } from "react-native";
import React from "react";
import { FlatList } from "react-native";
import { hp, wp } from "../common/helper";

const LatestItems = ({ source }) => {
  return (
    <View
      style={{
        marginTop: "5%",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ fontWeight: 600, fontSize: 15 }}>Latest Items</Text>
      <FlatList
        numColumns={2}
        data={source}
        renderItem={({ item, index }) => {
          return (
            <View
              style={{
                backgroundColor: "re",
                marginVertical: hp(2),
                marginVertical: wp(2),
                marginHorizontal: hp(2),
              }}
            >
              <View style={{ backgroundColor: "yellw" }}>
                <Image
                  source={{ uri: item.image }}
                  style={{
                    height: hp(15),
                    width: wp(40),
                    borderRadius: 10,
                  }}
                />
              </View>
              <View style={{}}>
                <Text style={{ fontSize: 15, fontWeight: 600 }}>
                  {item.title}
                </Text>
                <Text style={{ fontSize: 15, fontWeight: 600, color: "grey" }}>
                  {" "}
                  ₹{item.price}
                </Text>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
};

export default LatestItems;
