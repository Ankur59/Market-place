import { Redirect, Slot } from "expo-router";
import "react-native-reanimated";
import "../global.css";
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/clerk-expo";
``;
import { tokenCache } from "@/cache";

const publishableKey =
  "pk_test_ZXZvbHZlZC1maXJlZmx5LTUxLmNsZXJrLmFjY291bnRzLmRldiQ";
if (!publishableKey) {
  throw new Error("Missing publishableKey please provide it in your env file");
}
export default function RootLayout() {
  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      {/* Redirects to the home page if the user is signed in */}
      <SignedIn>
        <Redirect href="../(auth)/home" />
      </SignedIn>
      
      {/* Redirects to the welcome page if the user is not signed in */}
      <SignedOut>
        <Redirect href="../(public)/Welcome" />
      </SignedOut>
      <Slot />
    </ClerkProvider>
  );
}
