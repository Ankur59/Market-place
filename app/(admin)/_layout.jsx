import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { useRouter } from "expo-router";
import { useUser } from "@clerk/clerk-expo";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function AdminLayout() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { user } = useUser();

  return (
    <Stack>
      
      <Stack.Screen
        name="category"
        screenOptions={{
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="dashboard"
        screenOptions={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="product"
        screenOptions={{
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="reports"
        screenOptions={{
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="users"
        screenOptions={{
          headerShown: true,
        }}
      />
    </Stack>
  );
}
