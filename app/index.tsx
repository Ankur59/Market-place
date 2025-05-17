import { View, ActivityIndicator, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-expo";
import { router } from "expo-router";
import ErrorOverlay from "../components/ErrorOverlay";

const Index = () => {
  const { isLoaded, isSignedIn } = useAuth();
  const [status, setStatus] = useState("Initializing...");
  const [error, setError] = useState<string | null>(null);

  const navigateToScreen = async () => {
    try {
      if (isSignedIn) {
        setStatus("Signed in, navigating to home...");
        await new Promise((resolve) => setTimeout(resolve, 1000));
        router.replace({
          pathname: "/(auth)/home",
        });
      } else {
        setStatus("Not signed in, navigating to welcome...");
        await new Promise((resolve) => setTimeout(resolve, 1000));
        // Navigate to the public layout's index
        router.replace("/");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred";
      console.error("Navigation error:", err);
      setError(errorMessage);
    }
  };

  useEffect(() => {
    if (!isLoaded) {
      setStatus("Loading authentication...");
      return;
    }

    navigateToScreen();
  }, [isLoaded, isSignedIn]);

  const handleRetry = () => {
    setError(null);
    navigateToScreen();
  };

  if (error) {
    return <ErrorOverlay error={error} onRetry={handleRetry} />;
  }

  return (
    // This page is only used to show a loading indicator when the app is loading
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
      }}
    >
      <ActivityIndicator size="large" color="#6c47ff" />
      <Text
        style={{ marginTop: 10, marginHorizontal: 20, textAlign: "center" }}
      >
        {status}
      </Text>
    </View>
  );
};

export default Index;
