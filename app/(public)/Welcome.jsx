import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { router } from "expo-router";
import Loginscreen from "@/components/Loginscreen";

const Welcome = () => {
  return (
    // Main container with full screen dimensions and relative positioning
    <View className="flex-1 h-full w-full relative">
      {/* Set relative positioning here */}
      {/* Hero image section taking up 52% of the screen height */}
      <Image
        source={require("../../assets/images/login.jpg")}
        className="w-full h-[52%] object-cover"
      />
      {/* White overlay container positioned at bottom half of screen */}
      <View className="absolute bottom-0 left-0 right-0 h-[50%]  rounded-3xl bg-white">
        {/* Welcome text header section */}
        <View className="items-center justify-center w-full h-[20%] bg-white rounded-t-3xl">
          <Text className="text-[25px] font-bold self-center">
            Welcome to HavenMart!
          </Text>
        </View>

        {/* Description text section */}
        <View className="w-[100%] justify-center items-center bg-white">
          <View className="w-[50%] pb-[2%] pt-[2%]">
            <Text className="text-center">
              Buy and sell with ease, connecting with trusted buyers and
              sellers. Discover amazing deals across various categories.
            </Text>
          </View>
        </View>

        <View className="items-center mt-[5%] space-y-4">
          <TouchableOpacity
            className="bg-[#6E75F4] w-[70%] h-12 items-center justify-center rounded-xl"
            activeOpacity={0.5}
            onPress={() => router.push("/register")}
          >
            <Text className="text-white font-bold">Sign-up</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="w-[70%] h-12 items-center justify-center rounded-xl border border-[#6E75F4] mt-[5%]"
            activeOpacity={0.5}
            onPress={() => router.push("/login")}
          >
            <Text className="text-[#6E75F4] font-bold">Sign in</Text>
          </TouchableOpacity>

          <View className="w-[70%]">
            <Loginscreen />
          </View>
        </View>
      </View>
    </View>
  );
};

export default Welcome;
