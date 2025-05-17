import { Redirect, Stack } from "expo-router";
import "react-native-reanimated";
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/clerk-expo";
import { tokenCache } from "../cache";
import { ContextProvider } from "../Context/DataContext";
import SyncUserToFirestore from "../components/Syncwithfirebase";
import { useUserRole, UserRoleProvider } from "../Context/RoleContext";
import { useEffect, useState } from "react";
import { ThemeProvider } from "../Context/ThemeContext";
import { View, Text, ActivityIndicator } from "react-native";

const publishableKey =
  "pk_test_ZXZvbHZlZC1maXJlZmx5LTUxLmNsZXJrLmFjY291bnRzLmRldiQ";

if (!publishableKey) {
  throw new Error("Missing publishableKey please provide it in your env file");
}

// Error boundary component
const ErrorFallback = ({ error }) => (
  <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    <Text style={{ color: "red", marginBottom: 10 }}>
      Something went wrong:
    </Text>
    <Text>{error.message}</Text>
  </View>
);

// ✅ This component is wrapped by the context provider, so it's safe to use the hook here
function AppContent() {
  const { fetchUserData, userData } = useUserRole();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeData = async () => {
      try {
        console.log("Starting to fetch user data...");
        setIsLoading(true);
        await fetchUserData();
        console.log("User data fetched successfully");
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    initializeData();
  }, []);

  useEffect(() => {
    console.log("Current user data:", userData);
  }, [userData]);

  if (error) {
    return <ErrorFallback error={error} />;
  }

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#6c47ff" />
        <Text style={{ marginTop: 10 }}>Loading user data...</Text>
      </View>
    );
  }

  return (
    <>
      <Stack>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(public)" options={{ headerShown: false }} />
        <Stack.Screen name="productDetails" options={{ headerShown: true }} />
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="sso-callback" options={{ headerShown: false }} />
        <Stack.Screen name="ItemDetails" />
        <Stack.Screen name="CategoryPage" />
        <Stack.Screen name="ChatScreen" options={{ headerShown: false }} />
      </Stack>

      <SignedIn>
        <SyncUserToFirestore />
      </SignedIn>
      <SignedOut>
        <Redirect href="/(public)/Welcome" />
      </SignedOut>
    </>
  );
}

export default function RootLayout() {
  const [error, setError] = useState(null);

  if (error) {
    return <ErrorFallback error={error} />;
  }

  return (
    <ClerkProvider
      publishableKey={publishableKey}
      tokenCache={tokenCache}
      onError={(err) => {
        console.error("Clerk error:", err);
        setError(err);
      }}
    >
      <UserRoleProvider>
        <ContextProvider>
          <ThemeProvider>
            <AppContent />
          </ThemeProvider>
        </ContextProvider>
      </UserRoleProvider>
    </ClerkProvider>
  );
}
