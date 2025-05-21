import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useUser } from "@clerk/clerk-expo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { UseTheme } from "../Context/ThemeContext";

// List of admin emails - in a real app, this should be in a secure database
const ADMIN_EMAILS = ["admin@marketplace.com", "ankur7002151588@gmail.com"];

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user } = useUser();
  const { Theme, colorShades } = UseTheme();

  const isDark = Theme === "dark";
  const backgroundColor = isDark ? colorShades.blackShades.jet : "#fff";
  const textColor = isDark ? colorShades.whiteShades.ghostWhite : "#1f2937";
  const inputBgColor = isDark ? colorShades.blackShades.raisinBlack : "#f3f4f6";

  const handleLogin = async () => {
    if (!password) {
      Alert.alert("Error", "Please enter the admin password");
      return;
    }

    if (
      !user ||
      !ADMIN_EMAILS.includes(user.primaryEmailAddress?.emailAddress)
    ) {
      Alert.alert("Error", "Not authorized as admin");
      return;
    }

    setLoading(true);
    try {
      // For demo purposes, using a simple password
      if (password === "admin123") {
        // Set admin status in AsyncStorage
        await AsyncStorage.setItem(`admin_${user.id}`, "true");
        router.replace("/(admin)/dashboard");
      } else {
        Alert.alert("Error", "Invalid admin password");
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <View style={[styles.container, { backgroundColor }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color={isDark ? "#fff" : "#000"}
          />
        </TouchableOpacity>
        <View style={styles.contentContainer}>
          <Ionicons
            name="shield"
            size={60}
            color={isDark ? "#7c3aed" : "#7c3aed"}
          />
          <Text style={[styles.title, { color: textColor }]}>
            Admin Access Required
          </Text>
          <Text style={[styles.subtitle, { color: textColor }]}>
            Please sign in first to access the admin panel
          </Text>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#7c3aed" }]}
            onPress={() => router.push("/login")}
          >
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons
          name="arrow-back"
          size={24}
          color={isDark ? "#fff" : "#000"}
        />
      </TouchableOpacity>
      <View style={styles.contentContainer}>
        <Ionicons
          name="shield"
          size={60}
          color={isDark ? "#7c3aed" : "#7c3aed"}
        />
        <Text style={[styles.title, { color: textColor }]}>Admin Login</Text>
        <Text style={[styles.subtitle, { color: textColor }]}>
          Logged in as: {user.primaryEmailAddress?.emailAddress}
        </Text>

        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: inputBgColor,
              color: textColor,
              borderColor: isDark ? "#374151" : "#e5e5e5",
            },
          ]}
          placeholder="Admin Password"
          placeholderTextColor={isDark ? "#9ca3af" : "#6b7280"}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#7c3aed" }]}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Verifying..." : "Login as Admin"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 1,
    padding: 8,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
    textAlign: "center",
    opacity: 0.8,
  },
  input: {
    width: "100%",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    fontSize: 16,
  },
  button: {
    width: "100%",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
});
