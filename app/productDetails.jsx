import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useEffect } from "react";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";

const ProductDetails = () => {
  const route = useRoute();
  const { item } = route.params;
  return (
    <>
      <ScrollView style={styles.container}>
        <Image source={{ uri: item.image }} style={styles.image} />

        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.price}>₹{item.price}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{item.desc}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Seller Information</Text>
            <Text style={styles.sellerName}>{item.username}</Text>
            <View style={styles.locationContainer}>
              <Ionicons name="location" size={16} color="#666" />
              <Text style={styles.location}>{item.address}</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.contactButton}
            onPress={() => {
              // This is where you would implement contacting the seller
              alert("Contact seller feature coming soon!");
            }}
          >
            <Text style={styles.contactButtonText}>Contact Seller</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  image: {
    width: "100%",
    height: 300,
    resizeMode: "cover",
  },
  content: {
    padding: 16,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  price: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#6c47ff",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: "#666",
  },
  sellerName: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  location: {
    fontSize: 16,
    color: "#666",
    marginLeft: 4,
  },
  contactButton: {
    backgroundColor: "#6c47ff",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  contactButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default ProductDetails;
