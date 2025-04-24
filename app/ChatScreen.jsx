import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useUser } from "@clerk/clerk-expo";
import { db } from "../firebaseconfig";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";

const ChatScreen = () => {
  const route = useRoute();
  const { user, isLoaded } = useUser();
  const { SellerId } = route.params;

  const [messages, setMessages] = useState([]); // State for messages
  const [messageInput, setMessageInput] = useState(""); // State for input field

  //   Function to initialilze chat if not exists on firebase
  const createChatIfNotExists = async () => {
    const buyer_id = user.primaryEmailAddress?.emailAddress;
    const seller_id = SellerId;

    if (!buyer_id || !seller_id) return;

    const ChatId =
      buyer_id < seller_id
        ? `${buyer_id}_${seller_id}`
        : `${seller_id}_${buyer_id}`;

    const chatref = doc(db, "Chats", ChatId);
    const chatsnap = await getDoc(chatref);

    try {
      // Initiates the first message as Hi
      if (!chatsnap.exists()) {
        // Create chat document
        await setDoc(chatref, {
          lastMessage: "hi",
          lastUpdated: serverTimestamp(),
          participants: [buyer_id, seller_id],
        });

        const messagesRef = collection(db, "Chats", ChatId, "messages");

        await addDoc(messagesRef, {
          sender: buyer_id,
          data: "hi",
          timestamp: serverTimestamp(),
        });

        console.log("Chat and first message created.");
      } else {
        console.log("Chat already exists.");
      }
    } catch (Error) {
      console.log("Error creating chat:", Error);
    }
  };

  // Fetch messages from Firestore
  useEffect(() => {
    const fetchMessages = async () => {
      const buyer_id = user.primaryEmailAddress?.emailAddress;
      const seller_id = SellerId;

      if (!buyer_id || !seller_id) return;

      const ChatId =
        buyer_id < seller_id
          ? `${buyer_id}_${seller_id}`
          : `${seller_id}_${buyer_id}`;

      const messagesRef = collection(db, "Chats", ChatId, "messages");

      const q = query(messagesRef, orderBy("timestamp", "asc"));

      // Listen for real-time updates in the firestore database
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const messagesArray = querySnapshot.docs.map((doc) => doc.data());
        setMessages(messagesArray); // Update the state with the fetched messages
      });

      // Clean up the listener when the component unmounts
      return () => unsubscribe();
    };

    if (isLoaded && user) {
      createChatIfNotExists();
      fetchMessages();
    }
  }, [isLoaded, user, SellerId]);

  const handleSendMessage = async () => {
    const buyer_id = user.primaryEmailAddress?.emailAddress;
    const seller_id = SellerId;

    if (!buyer_id || !seller_id || !messageInput) return;

    const ChatId =
      buyer_id < seller_id
        ? `${buyer_id}_${seller_id}`
        : `${seller_id}_${buyer_id}`;

    const messagesRef = collection(db, "Chats", ChatId, "messages");

    await addDoc(messagesRef, {
      sender: buyer_id,
      data: messageInput,
      timestamp: serverTimestamp(),
    });

    setMessageInput(""); // Clear input field after sending
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Seller Name</Text>
      </View>

      {/* Message List */}
      <FlatList
        data={messages} // The messages from Firestore
        renderItem={({ item }) => (
          <View
            style={[
              styles.messageBubble,
              item.sender === user.primaryEmailAddress?.emailAddress
                ? styles.theirMessage
                : styles.myMessage,
            ]}
          >
            <Text style={styles.messageText}>{item.data}</Text>
            <Text style={styles.timeText}>
              {new Date(item.timestamp?.seconds * 1000).toLocaleTimeString()}
            </Text>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.messagesList}
      />

      {/* Input Area */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          multiline
          value={messageInput}
          onChangeText={setMessageInput}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
          <Ionicons name="send" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  messagesList: {
    padding: 16,
  },
  messageBubble: {
    maxWidth: "75%",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginBottom: 10,
  },
  myMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#6c47ff",
  },
  theirMessage: {
    alignSelf: "flex-start",
    backgroundColor: "grey",
  },
  messageText: {
    fontSize: 16,
    color: "#fff",
  },
  timeText: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.7)",
    alignSelf: "flex-end",
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    backgroundColor: "#fff",
    alignItems: "center",
  },
  input: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 100,
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: "#6c47ff",
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ChatScreen;
