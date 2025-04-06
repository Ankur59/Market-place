import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRoute } from "@react-navigation/native";
import { useAuth } from "../Context/DataContext";
import { FlatList } from "react-native";
import ProductCard from "../components/Card";
import { useNavigation } from "@react-navigation/native";

const CategoryPage = () => {
  const navigation = useNavigation();
  const [FilterPost, SetFilterPost] = useState([]);
  const route = useRoute();
  const { category } = route.params;
  const { Posts, GetPostsData } = useAuth();

  useEffect(() => {
    navigation.setOptions({
      title: category.Name,
      headerStyle: {
        backgroundColor: "#6c47ff", // 🔥 header background
      },
      headerTintColor: "#fff",
      headerTitleStyle: {
        color: "white", // Optional styling
      },
    });
  }, []);
  useEffect(() => {
    GetPostsData();
  }, []);

  useEffect(() => {
    SetFilterPost(Posts.filter((item) => item.category === category.Name));
  }, [Posts]);
  return (
    <View style={styles.container}>
      <FlatList
        numColumns={2}
        data={FilterPost}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
});

export default CategoryPage;
