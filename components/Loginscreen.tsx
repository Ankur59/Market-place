import React, { useCallback, useEffect } from "react";
import * as WebBrowser from "expo-web-browser";
import { useOAuth } from "@clerk/clerk-expo";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import { AntDesign } from "@expo/vector-icons";

export const useWarmUpBrowser = () => {
  useEffect(() => {
    // Preloads the browser for Android devices to reduce authentication load time
    // See: https://docs.expo.dev/guides/authentication/#improving-user-experience
    void WebBrowser.warmUpAsync();
    return () => {
      // Cleanup: closes browser when component unmounts
      void WebBrowser.coolDownAsync();
    };
  }, []);
};

// Handle any pending authentication sessions
WebBrowser.maybeCompleteAuthSession();

export default function Page() {
  useWarmUpBrowser();
  const router = useRouter();
  const { startOAuthFlow } = useOAuth({
    strategy: "oauth_google",
    redirectUrl: "havenmart://oauth-native-callback",
  });

  const onPress = useCallback(async () => {
    try {
      console.log("Starting Google OAuth flow...");
      const { createdSessionId, setActive } = await startOAuthFlow();

      console.log("OAuth flow completed:", {
        createdSessionId: !!createdSessionId,
      });

      if (createdSessionId) {
        console.log("Setting active session...");
        await setActive?.({ session: createdSessionId });
        router.replace("(auth)/home" as any);
      } else {
        console.log("No session created");
        Alert.alert(
          "Sign In Failed",
          "Unable to sign in with Google. Please try again."
        );
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
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.googleButton}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <AntDesign
          name="google"
          size={22}
          color="#4285F4"
          style={styles.icon}
        />
        <Text style={styles.buttonText}>Continue with Google</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: "10%",
    width: "100%",
    alignItems: "center",
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 14,
    width: "100%",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  icon: {
    marginRight: 12,
  },
  buttonText: {
    color: "#333",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    flex: 1,
  },
});
