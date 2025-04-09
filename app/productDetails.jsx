import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Share,
} from "react-native";
import React, { useEffect } from "react";
import { useRoute } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import { Feather, Ionicons } from "@expo/vector-icons";

const ProductDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { item } = route.params;

  useEffect(() => {
    setHeaderShareButton();
  }, [navigation]);

  const Customshare = async () => {
    content = {
      message: `Take a look at this amazing product ${item.name} i found at havensmart ${item.desc}`,
    };
    Share.share(content);
  };
  const setHeaderShareButton = () => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={Customshare}>
          <Feather
            name="share-2"
            size={24}
            color="black"
            style={{ marginRight: 15 }}
          />
        </TouchableOpacity>
      ),
    });
  };

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

export default ProductDetails;

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

// const customShare = async () => {
//   const canShare = await Sharing.isAvailableAsync();
//   if (!canShare) {
//     alert("Sharing is not available on this device");
//     return;
//   }

//   try {
//     const fileUri = FileSystem.documentDirectory + "shared-image.jpg";

//     const downloadResumable = FileSystem.createDownloadResumable(
//       item.image,
//       fileUri
//     );

//     const { uri } = await downloadResumable.downloadAsync();
//     await Sharing.shareAsync(uri);
//   } catch (error) {
//     console.log("Error sharing file:", error);
//   }
// };
