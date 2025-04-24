import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Share,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useRoute } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import { Feather, Ionicons } from "@expo/vector-icons";

const ProductDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { item } = route.params;

  // State to store share message and loading state
  const [shareMessage, setShareMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Generate the share message when the component mounts
  useEffect(() => {
    const msg = `Take a look at this amazing product ${item.name} I found at Havensmart: ${item.desc}`;
    setShareMessage(msg);
  }, []);

  // Share function triggered when the share button is clicked
  const Customshare = async () => {
    if (!shareMessage.trim()) {
      alert("Message not ready to share.");
      return;
    }

    try {
      setLoading(true); // Show loading spinner
      await Share.share({ message: shareMessage });
    } catch (error) {
      alert("Something went wrong while sharing.");
      console.error("Error sharing:", error);
    } finally {
      setLoading(false); // Hide loading spinner after share
    }
  };
  return (
    <>
      <ScrollView style={styles.container}>
        <View>
          <Image source={{ uri: item.image }} style={styles.image} />
          <View
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              backgroundColor: "white",
              padding: 5,
              borderRadius: 100,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TouchableOpacity onPress={Customshare} disabled={loading}>
              <Feather name="share-2" size={24} color="black" />
            </TouchableOpacity>
          </View>
        </View>
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
            onPress={() =>
              navigation.navigate("ChatScreen", { SellerId: item.useremail })
            }
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
