import { useRouter } from "expo-router";
import { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { useAuth, useOAuth } from "@clerk/clerk-expo";

export default function SSOCallback() {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();
  const { handleOAuthCallback } = useOAuth();

  // This use effect is called when there is a change in islaoded and issignedin

  useEffect(() => {
    // if the authentication is completed isloaded will be true the handleOAuthcallback will be called
    if (isLoaded) {
      handleOAuthCallback();
    }

    // If the user session token is genrated issigned will be true then the user will be redirected to the home screen
    if (isSignedIn) {
      router.replace("/(auth)/home");
    } else {  
      
      // If no condition matches then it means the session is not created so we can redirect the user to the welcome page which is public
      router.replace("/(public)/Welcome");
    }
  }, [isLoaded, isSignedIn]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="#6E75F4" />
    </View>
  );
}
