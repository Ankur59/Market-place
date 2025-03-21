import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import React from "react";
import { useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const sampleListings = [
  {
    id: "1",
    title: "iPhone 13 Pro",
    price: 74999,
    description: "Excellent condition, 256GB storage",
    image: "https://images.unsplash.com/photo-1632661674596-618d5e97ab56",
    seller: "Arjun Patel",
    location: "Mumbai, MH",
  },
  {
    id: "2",
    title: "MacBook Pro M1",
    price: 109999,
    description: "Like new, 512GB SSD, 16GB RAM",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca4",
    seller: "Priya Sharma",
    location: "Bangalore, KA",
  },
  {
    id: "3",
    title: "Sony PS5",
    price: 49999,
    description: "Brand new, sealed in box",
    image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db",
    seller: "Rahul Verma",
    location: "Delhi, DL",
  },
  {
    id: "4",
    title: "Nike Air Max",
    price: 9999,
    description: "Size 10, worn once",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
    seller: "Zara Khan",
    location: "Chennai, TN",
  },
  {
    id: "5",
    title: "Canon EOS R5",
    price: 299999,
    description: "Professional camera, includes 24-70mm lens",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32",
    seller: "Aditya Menon",
    location: "Hyderabad, TS",
  },
  {
    id: "6",
    title: "Samsung 4K TV",
    price: 64999,
    description: "65-inch, Smart TV with HDR",
    image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1",
    seller: "Meera Iyer",
    location: "Pune, MH",
  },
];

const ListingCard = ({ item }) => {
  const router = useRouter();

  const formatPrice = (price) => {
    return price.toLocaleString("en-IN");
  };

  const handlePress = () => {
    router.push({
      pathname: "/(auth)/productDetails",
      params: { item: JSON.stringify(item) },
    });
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.cardContent}>
        <Text style={styles.title} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.price}>₹{formatPrice(item.price)}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.footer}>
          <View style={styles.sellerInfo}>
            <Ionicons name="location" size={14} color="#666" />
            <Text style={styles.location}>{item.location}</Text>
          </View>
          <Text style={styles.seller}>{item.seller}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const Home = () => {
  const { user } = useUser();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome back,</Text>
        <Text style={styles.userName}>{user?.firstName || "User"}!</Text>
      </View>

      <FlatList
        data={sampleListings}
        renderItem={({ item }) => <ListingCard item={item} />}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    padding: 20,
    backgroundColor: "#fff",
  },
  welcomeText: {
    fontSize: 16,
    color: "#666",
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
  },
  listContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: "100%",
    height: 200,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  cardContent: {
    padding: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  price: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#6c47ff",
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  sellerInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  location: {
    fontSize: 14,
    color: "#666",
    marginLeft: 4,
  },
  seller: {
    fontSize: 14,
    color: "#666",
  },
});

export default Home;
