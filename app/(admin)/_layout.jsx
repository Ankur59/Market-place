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

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        router.replace("/");
        return;
      }

      const adminStatus = await AsyncStorage.getItem(`admin_${user.id}`);
      if (!adminStatus) {
        router.replace("/");
      } else {
        setIsAdmin(true);
      }
      setLoading(false);
    };

    checkAdminStatus();
  }, [user]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}
