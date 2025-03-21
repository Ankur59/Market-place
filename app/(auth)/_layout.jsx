import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Pressable } from "react-native";
import { useAuth } from "@clerk/clerk-expo";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export const LogoutButton = () => {
  const { signOut } = useAuth();

  const doLogout = () => {
    signOut();
  };

  return (
    <Pressable onPress={doLogout} style={{ marginRight: 10 }}>
      <Ionicons name="log-out-outline" size={24} color={"#fff"} />
    </Pressable>
  );
};

const TabsPage = () => {
  const { isSignedIn } = useAuth();

  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: "#6c47ff",
        },
        headerTintColor: "#fff",
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          headerTitle: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
          tabBarLabel: "Home",
        }}
        redirect={!isSignedIn}
      />

      <Tabs.Screen
        name="explore"
        options={{
          headerTitle: "Explore",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="compass-outline" size={size} color={color} />
          ),
          tabBarLabel: "Explore",
        }}
        redirect={!isSignedIn}
      />
      <Tabs.Screen
        name="addpost"
        options={{
          headerTitle: "Add",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="sell" size={24} color={color} />
          ),
          tabBarLabel: "Sell",
        }}
        redirect={!isSignedIn}
      />
      <Tabs.Screen
        name="profile"
        options={{
          headerTitle: "My Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
          tabBarLabel: "My Profile",
          headerRight: () => <LogoutButton />,
        }}
        redirect={!isSignedIn}
      />
    </Tabs>
  );
};

export default TabsPage;
