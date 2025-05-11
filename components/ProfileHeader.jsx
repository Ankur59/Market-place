import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { useUser } from "@clerk/clerk-expo";
import { hp, wp } from "../common/helper";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "expo-router";

const ProfileHeader = ({ posts, setFilteredPosts }) => {
  const { user } = useUser();
  const navigation = useNavigation();

  return (
    <View>
      {/* Header User Info Section */}
      <View
        style={{
          flexDirection: "row",
          backgroundColor: "transparent",
          alignItems: "center",
          marginTop: "10%",
        }}
      >
        <View style={{ backgroundColor: "transparent", marginLeft: 10 }}>
          <Image
            source={{ uri: user?.imageUrl }}
            style={{
              height: hp(4),
              width: hp(4),
              borderRadius: 100,
            }}
          />
        </View>
        <View style={{ marginLeft: 10 }}>
          <Text style={{ fontWeight: "600", fontSize: 15 }}>Welcome</Text>
          <Text style={{ fontWeight: "600", fontSize: 15 }}>
            {user?.fullName}
          </Text>
        </View>
      </View>

      {/* Search Button Section */}
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
          <TouchableOpacity
            style={{ flex: 1, padding: 10 }}
            onPress={() => {
              navigation.navigate("SearchPage");
            }}
          >
            <Text style={{ color: "#888" }}>Search</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ProfileHeader;
