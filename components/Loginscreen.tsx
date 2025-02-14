import React, { useCallback, useEffect } from "react";
import * as WebBrowser from "expo-web-browser";
import { useOAuth } from "@clerk/clerk-expo";
import { View, Button, Alert } from "react-native";
import { useRouter } from "expo-router";

export const useWarmUpBrowser = () => {
  useEffect(() => {
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);
};

WebBrowser.maybeCompleteAuthSession();

export default function Page() {
  useWarmUpBrowser();
  const router = useRouter();
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });

  const onPress = useCallback(async () => {
    try {
      console.log("Starting Google OAuth flow...");
      const { createdSessionId, signIn, signUp, setActive } =
        await startOAuthFlow();

      console.log("OAuth flow completed:", {
        createdSessionId: !!createdSessionId,
        signIn: !!signIn,
        signUp: !!signUp,
      });

      if (createdSessionId) {
        console.log("Setting active session...");
        await setActive?.({ session: createdSessionId });
        router.replace("(auth)/home" as any);
      } else {
        console.log("No session created");
        if (signIn || signUp) {
          console.log("Additional verification needed");
          Alert.alert(
            "Verification Required",
            "Please complete the verification process."
          );
        } else {
          Alert.alert(
            "Sign In Failed",
            "Unable to sign in with Google. Please try again."
          );
        }
      }
    } catch (err: any) {
      console.error("OAuth Error:", err);
      Alert.alert(
        "Authentication Error",
        err.message || "An error occurred during sign in. Please try again."
      );
    }
  }, []);

  return (
    <View style={{ width: "100%" }}>
      <Button title="Sign in with Google" onPress={onPress} color="#6E75F4" />
    </View>
  );
}
