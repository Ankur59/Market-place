import { View, Text } from "react-native";
import React from "react";
import { useRoute } from "@react-navigation/native";
import LatestItems from "../components/LatestItems";
import { hp } from "../common/helper";
import { AntDesign } from "@expo/vector-icons";
import { TextInput } from "react-native";
import { useRouter } from "expo-router";

const Explore = () => {
  const route = useRoute();
  const router = useRouter();
  const { Data, Searchvalue } = route.params;
  console.log("Data", Data, "Searchvalue", Searchvalue);
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
            value={Searchvalue}
            onPress={() => {
              router.push("/SearchPage");
            }}
            onSubmitEditing={() => {
              handleSearch(Search);
            }}
          />
        </View>
      </View>
      <LatestItems source={Data} />
    </View>
  );
};

export default Explore;
