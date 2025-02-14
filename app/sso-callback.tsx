import { useRouter } from "expo-router";
import { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { useAuth, useOAuth } from "@clerk/clerk-expo";

export default function SSOCallback() {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();
  const { handleOAuthCallback } = useOAuth();

  useEffect(() => {
    if (isLoaded) {
      handleOAuthCallback();
      if (isSignedIn) {
        router.replace("/(auth)/home");
      } else {
        router.replace("/(public)/Welcome");
      }
    }
  }, [isLoaded, isSignedIn]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="#6E75F4" />
    </View>
  );
}
