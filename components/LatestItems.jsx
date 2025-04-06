import { View, Text, Image } from "react-native";
import React from "react";
import { FlatList } from "react-native";
import { hp, wp } from "../common/helper";
import ProductCard from "./Card";
import { useNavigation } from "@react-navigation/native";

const LatestItems = ({ source }) => {
  const navigation = useNavigation();
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
            <ProductCard
              imageUrl={item.image}
              name={item.name}
              price={item.price}
              action={() => navigation.navigate("productDetails", { item })}
            />
          );
        }}
      />
    </View>
  );
};

export default LatestItems;
