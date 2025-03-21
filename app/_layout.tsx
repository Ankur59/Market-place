import { Redirect, Slot } from "expo-router";
import "react-native-reanimated";
import "../global.css";
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/clerk-expo";
import { tokenCache } from "@/cache";

const publishableKey =
  "pk_test_ZXZvbHZlZC1maXJlZmx5LTUxLmNsZXJrLmFjY291bnRzLmRldiQ";
if (!publishableKey) {
  throw new Error("Missing publishableKey please provide it in your env file");
}
export default function RootLayout() {
  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <SignedIn>
        <Redirect href="../(auth)/home" />
      </SignedIn>

      <SignedOut>
        <Redirect href="../(public)/Welcome" />
      </SignedOut>
      <Slot />
    </ClerkProvider>
  );
}
