import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import React from "react";
import { hp, wp } from "../common/helper";
import { useNavigation } from "@react-navigation/native";

const Category = ({ source }) => {
  const navigation = useNavigation();
  return (
    <View
      style={{
        backgroundColor: "rd",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "3.6%",
      }}
    >
      <Text style={{ marginBottom: "1%", fontWeight: 600, fontSize: 15 }}>
        Categories
      </Text>
      <FlatList
        data={source}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item, index }) => {
          return (
            <TouchableOpacity
              style={{
                backgroundColor: "rd",
                justifyContent: "space-around",
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                width: wp(17),
              }}
              onPress={() =>
                navigation.navigate('CategoryPage', { category: item })
              }
            >
              <Image
                source={{ uri: item.Image }}
                style={{ height: hp(6), width: hp(6), borderRadius: 100 }}
              />
              {/* <Text>{item.Name}</Text> */}
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

export default Category;
