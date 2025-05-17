import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { router } from "expo-router";
import Loginscreen from "@/components/Loginscreen";

const Welcome = () => {
  return (
    // Main container with full screen dimensions and relative positioning
    <View style={styles.container}>
      {/* Set relative positioning here */}
      {/* Hero image section taking up 52% of the screen height */}
      <Image
        source={require("../../assets/images/login.jpg")}
        style={styles.heroImage}
      />
      {/* White overlay container positioned at bottom half of screen */}
      <View style={styles.overlay}>
        {/* Welcome text header section */}
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Welcome to HavenMart!</Text>
        </View>

        {/* Description text section */}
        <View style={styles.descriptionContainer}>
          <View style={styles.descriptionTextContainer}>
            <Text style={styles.descriptionText}>
              Buy and sell with ease, connecting with trusted buyers and
              sellers. Discover amazing deals across various categories.
            </Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.signupButton}
            activeOpacity={0.5}
            onPress={() => router.push("/register")}
          >
            <Text style={styles.signupButtonText}>Sign-up</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.signinButton}
            activeOpacity={0.5}
            onPress={() => router.push("/login")}
          >
            <Text style={styles.signinButtonText}>Sign in</Text>
          </TouchableOpacity>

          <View style={styles.spacer}></View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    position: "relative",
  },
  heroImage: {
    width: "100%",
    height: "52%",
    resizeMode: "cover",
  },
  overlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "50%",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: "white",
  },
  headerContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "20%",
    backgroundColor: "white",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  headerText: {
    fontSize: 25,
    fontWeight: "bold",
    alignSelf: "center",
  },
  descriptionContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  descriptionTextContainer: {
    width: "50%",
    paddingBottom: "2%",
    paddingTop: "2%",
  },
  descriptionText: {
    textAlign: "center",
  },
  buttonContainer: {
    alignItems: "center",
    marginTop: "5%",
    gap: 16,
  },
  signupButton: {
    backgroundColor: "#6E75F4",
    width: "70%",
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
  },
  signupButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  signinButton: {
    width: "70%",
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#6E75F4",
    marginTop: "5%",
  },
  signinButtonText: {
    color: "#6E75F4",
    fontWeight: "bold",
  },
  spacer: {
    width: "70%",
  },
});

export default Welcome;
