import { View, ActivityIndicator, Text } from "react-native";
import React, { useEffect } from "react";
import { useAuth } from "@clerk/clerk-expo";
import { router } from "expo-router";

const Index = () => {
  const { isLoaded, isSignedIn } = useAuth();

  useEffect(() => {
    if (isLoaded) {
      console.log("Auth state loaded. isSignedIn:", isSignedIn);
      try {
        if (isSignedIn) {
          console.log("Navigating to (auth)/home");
          router.replace("/(auth)/home");
        } else {
          console.log("Navigating to (public)/Welcome");
          router.replace("/(public)/Welcome");
        }
      } catch (error) {
        console.error("Navigation error:", error);
      }
    }
  }, [isLoaded, isSignedIn]);

  return (
    // This page is only used to show a loading indicator when the app is loading
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="#0000ff" />
      <Text style={{ marginTop: 10 }}>Loading...</Text>
    </View>
  );
};

export default Index;
