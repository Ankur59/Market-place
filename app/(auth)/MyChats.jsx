import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-expo";
import {
  collection,
  getDocs,
  getFirestore,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { app } from "../../firebaseconfig";
import { Feather } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

const MyChats = () => {
  const { user, isLoaded } = useUser();
  const [loading, setLoading] = useState(true);
  const [chats, setChats] = useState([]);
  const username = user?.primaryEmailAddress?.emailAddress;
  const db = getFirestore(app);
  const navigation = useNavigation();

  // Use useFocusEffect to refresh data when the screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      if (isLoaded && username) {
        fetchChats();
      }
    }, [isLoaded, username])
  );

  const fetchChats = async () => {
    if (!username) return;

    try {
      const chatsRef = collection(db, "Chats");
      const q = query(
        chatsRef,
        where("participants", "array-contains", username)
      );

      // Use onSnapshot for real-time updates
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const chatData = snapshot.docs.map((doc) => {
          const data = doc.data();
          const chatId = doc.id;

          // Extract the other user's email from participants array
          const otherUserEmail =
            data.participants?.find((email) => email !== username) || "";

          // Gather all necessary data for navigation
          return {
            id: chatId,
            otherUserEmail,
            lastMessage: data.lastMessage || "No messages yet",
            lastUpdated: data.lastUpdated
              ? data.lastUpdated.toDate()
              : new Date(),
            participants: data.participants || [],
            productName: data.productName || "",
            productPrice: data.productPrice || "",
            SellerId: data.SellerId || otherUserEmail,
            docId: data.docId || chatId,
            buyer_id: data.buyer_id || otherUserEmail,

            // Add any other fields needed for ChatScreen
          };
        });

        // Sort chats by most recent first
        const sortedChats = chatData.sort(
          (a, b) => b.lastUpdated - a.lastUpdated
        );
        setChats(sortedChats);
        setLoading(false);
      });

      return unsubscribe;
    } catch (error) {
      console.error("Error fetching chats:", error);
      setLoading(false);
    }
  };

  const navigateToChat = (item) => {
    // Prepare the navigation params to match the expected format in ChatScreen
    navigation.navigate("ChatScreen", {
      SellerId: item.SellerId,
      buyerId: item.buyer_id,
      item: {
        docId: item.docId || item.id,
        name: item.productName,
        price: item.productPrice,
        userimage: "", // Add a default image or fetch from user profile
        lastMessage: item.lastMessage,
      },
    });
  };

  const getInitials = (email) => {
    if (!email) return "?";
    return email.charAt(0).toUpperCase();
  };

  // Function to format time difference
  const formatTimeAgo = (date) => {
    if (!date) return "";

    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffDay > 0) {
      return diffDay === 1 ? "yesterday" : `${diffDay} days ago`;
    } else if (diffHour > 0) {
      return `${diffHour} ${diffHour === 1 ? "hour" : "hours"} ago`;
    } else if (diffMin > 0) {
      return `${diffMin} ${diffMin === 1 ? "minute" : "minutes"} ago`;
    } else {
      return "just now";
    }
  };

  const renderChatItem = ({ item }) => {
    // Get partner email from participants, excluding current user
    const partnerEmail =
      item.participants?.find((email) => email !== username) ||
      item.otherUserEmail ||
      item.SellerId;

    return (
      <TouchableOpacity
        onPress={() => navigateToChat(item)}
        style={styles.chatItem}
      >
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{getInitials(partnerEmail)}</Text>
        </View>

        <View style={styles.chatContent}>
          <View style={styles.headerRow}>
            <Text style={styles.emailText} numberOfLines={1}>
              {partnerEmail}
            </Text>
            <Text style={styles.timeText}>
              {formatTimeAgo(item.lastUpdated)}
            </Text>
          </View>

          <View style={styles.messageContainer}>
            <Text style={styles.messageText} numberOfLines={1}>
              {item.lastMessage}
            </Text>
          </View>

          {item.productName && (
            <View style={styles.productBadge}>
              <Text style={styles.productText}>
                {item.productName}{" "}
                {item.productPrice ? `- ₹${item.productPrice}` : ""}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  if (!isLoaded || loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
      </View>

      {chats.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Feather name="message-circle" size={60} color="#d1d5db" />
          <Text style={styles.emptyTextMain}>No conversations yet</Text>
          <Text style={styles.emptyTextSub}>
            When you start chatting with sellers or buyers, you'll see them here
          </Text>
        </View>
      ) : (
        <FlatList
          data={chats}
          keyExtractor={(item) => item.id}
          renderItem={renderChatItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  header: {
    padding: 16,
    paddingTop: 24,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1f2937",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9fafb",
  },
  listContainer: {
    padding: 16,
  },
  chatItem: {
    marginBottom: 12,
    padding: 12,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  avatar: {
    height: 48,
    width: 48,
    borderRadius: 24,
    backgroundColor: "#dbeafe",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#3b82f6",
  },
  chatContent: {
    flex: 1,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  emailText: {
    fontWeight: "600",
    fontSize: 16,
    color: "#1f2937",
    flex: 1,
    marginRight: 8,
  },
  timeText: {
    fontSize: 12,
    color: "#9ca3af",
  },
  messageContainer: {
    marginTop: 4,
  },
  messageText: {
    color: "#6b7280",
    fontSize: 14,
  },
  productBadge: {
    marginTop: 6,
    backgroundColor: "#f3f4f6",
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  productText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#4b5563",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  emptyTextMain: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: "600",
    color: "#9ca3af",
  },
  emptyTextSub: {
    marginTop: 8,
    fontSize: 14,
    color: "#9ca3af",
    textAlign: "center",
  },
});

export default MyChats;
