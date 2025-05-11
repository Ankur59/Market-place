import { View, Text, Image, TextInput } from "react-native";
import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-expo";
import { hp, wp } from "../common/helper";
import { AntDesign } from "@expo/vector-icons";
import { useAuth } from "../Context/DataContext";
import Category from "../components/Categories";
import { useNavigation } from "expo-router";

const SearchPage = () => {
  const [Search, setSearch] = useState("");
  const navigation = useNavigation();
  const [FilterPost, SetFilterPost] = useState([]);
  const { GetCategoryData, Categories, Posts, GetPostsData } = useAuth();
  const handleSearch = (value) => {
    SetFilterPost(
      Posts.filter((item) =>
        item.desc.toLowerCase().includes(value.toLowerCase())
      )
    );
    navigation.navigate("explore", { Data: FilterPost,Searchvalue:value });
  };

    useEffect(() => {
      if (FilterPost.length > 0) {
        navigation.navigate("explore", {
          Data: FilterPost,
          Searchvalue: Search,
        });
        // Clear FilterPost after navigation
        SetFilterPost([]);
      }
    }, [FilterPost]); 

  return (
    <View>
      <View style={{ width: "100%", alignItems: "center" }}>
        <View
          style={{
            width: "85%",
            borderWidth: 1,
            borderRadius: 20,
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 10,
            marginTop: hp(2),
          }}
        >
          <AntDesign
            name="search1"
            size={24}
            color="black"
            style={{ marginRight: 8 }}
          />
          <TextInput
            style={{
              flex: 1,
              padding: 10,
              borderWidth: 0,
            }}
            placeholder="Search"
            onChangeText={(e) => setSearch(e)}
            onSubmitEditing={() => {
              handleSearch(Search);
            }}
          />
        </View>
      </View>
      <Category source={Categories} />
    </View>
  );
};

export default SearchPage;
