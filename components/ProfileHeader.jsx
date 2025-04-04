import { View, Text, Image, TextInput } from "react-native";
import React from "react";
import { useUser } from "@clerk/clerk-expo";
import { hp, wp } from "../common/helper";
import { AntDesign } from "@expo/vector-icons";

const ProfileHeader = () => {
  const { user } = useUser();
  return (
    // Header Section
    <View>
      <View
        style={{
          flexDirection: "row",
          backgroundColor: "rd",
          alignItems: "center",
          marginTop: 10,
        }}
      >
        <View style={{ backgroundColor: "yelow", marginLeft: 10 }}>
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
          <View>
            <Text style={{ fontWeight: 600, fontSize: 15 }}>Welcome</Text>
          </View>
          <View>
            <Text style={{ fontWeight: 600, fontSize: 15 }}>
              {user?.fullName}
            </Text>
          </View>
        </View>
      </View>
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
          />
        </View>
      </View>
    </View>
  );
};

export default ProfileHeader;
