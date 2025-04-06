import { Redirect, Stack } from "expo-router";
import "react-native-reanimated";
import "../global.css";
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/clerk-expo";
import { tokenCache } from "@/cache";
import { ContextProvider } from "../Context/DataContext";




const publishableKey =
  "pk_test_ZXZvbHZlZC1maXJlZmx5LTUxLmNsZXJrLmFjY291bnRzLmRldiQ";

if (!publishableKey) {
  throw new Error("Missing publishableKey please provide it in your env file");
}

export default function RootLayout() {

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <ContextProvider>
        {" "}
        {/* ✅ Wrap everything inside this */}
        <Stack>
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(public)" options={{ headerShown: false }} />
          <Stack.Screen name="productDetails" options={{ headerShown: true }} />
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="sso-callback" options={{ headerShown: false }} />
          <Stack.Screen name="ItemDetails" />
          <Stack.Screen name="CategoryPage" />
        </Stack>
        <SignedIn>
          <Redirect href="../(auth)/home" />
        </SignedIn>
        <SignedOut>
          <Redirect href="../(public)/Welcome" />
        </SignedOut>
      </ContextProvider>
    </ClerkProvider>
  );
}
