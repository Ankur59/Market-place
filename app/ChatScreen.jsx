import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  SafeAreaView,
  Keyboard,
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
import { Image } from "expo-image";

const ChatScreen = () => {
  const route = useRoute();
  const { user, isLoaded } = useUser();
  const { SellerId, item, buyerId } = route.params;
  const flatListRef = useRef(null);

  const [messages, setMessages] = useState([]); // State for messages
  const [messageInput, setMessageInput] = useState(""); // State for input field
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  //   Function to initialilze chat if not exists on firebase
  const usermail = user?.primaryEmailAddress?.emailAddress;

  const createChatIfNotExists = async () => {
    const buyer_id = buyerId;
    const seller_id = SellerId;
    const docId = item.docId;

    if (!buyer_id || !seller_id) return;

    const ChatId =
      buyer_id < seller_id
        ? `${buyer_id}_${seller_id}_${docId}`
        : `${seller_id}_${buyer_id}_${docId}`;

    const chatref = doc(db, "Chats", ChatId);
    const chatsnap = await getDoc(chatref);

    try {
      // Initiates the first message as Hi
      if (!chatsnap.exists()) {
        // Create chat document
        await setDoc(chatref, {
          lastMessage: "I am interested in your product!",
          lastUpdated: serverTimestamp(),
          participants: [buyer_id, seller_id],
          productName: item.name,
          productPrice: item.price,
          SellerId: seller_id,
          docId: item.docId,
          buyer_id: buyer_id,
        });

        const messagesRef = collection(db, "Chats", ChatId, "messages");

        await addDoc(messagesRef, {
          sender: usermail,
          data: `I am interested in your ${item.name}`,
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

  // Listen for keyboard events
  useEffect(() => {
    const keyboardWillShowListener =
      Platform.OS === "ios"
        ? Keyboard.addListener("keyboardWillShow", () => {
            setKeyboardVisible(true);
            // Scroll to bottom when keyboard appears
            if (flatListRef.current && messages.length > 0) {
              flatListRef.current.scrollToEnd({ animated: true });
            }
          })
        : null;

    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true);
        // Scroll to bottom when keyboard appears
        if (flatListRef.current && messages.length > 0) {
          flatListRef.current.scrollToEnd({ animated: true });
        }
      }
    );

    const keyboardWillHideListener =
      Platform.OS === "ios"
        ? Keyboard.addListener("keyboardWillHide", () => {
            setKeyboardVisible(false);
          })
        : null;

    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      if (keyboardWillShowListener) keyboardWillShowListener.remove();
      if (keyboardDidShowListener) keyboardDidShowListener.remove();
      if (keyboardWillHideListener) keyboardWillHideListener.remove();
      if (keyboardDidHideListener) keyboardDidHideListener.remove();
    };
  }, [messages.length]);

  // Fetch messages from Firestore
  useEffect(() => {
    const fetchMessages = async () => {
      const buyer_id = buyerId;
      const seller_id = SellerId;
      const docId = item.docId;

      if (!buyer_id || !seller_id) return;

      const ChatId =
        buyer_id < seller_id
          ? `${buyer_id}_${seller_id}_${docId}`
          : `${seller_id}_${buyer_id}_${docId}`;

      const messagesRef = collection(db, "Chats", ChatId, "messages");

      const q = query(messagesRef, orderBy("timestamp", "asc"));

      // Listen for real-time updates in the firestore database
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const messagesArray = querySnapshot.docs.map((doc) => doc.data());
        setMessages(messagesArray); // Update the state with the fetched messages

        // Scroll to bottom when new messages arrive
        if (flatListRef.current && messagesArray.length > 0) {
          setTimeout(() => {
            flatListRef.current.scrollToEnd({ animated: true });
          }, 200);
        }
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
    const buyer_id = buyerId;
    const seller_id = SellerId;
    const docId = item.docId;

    if (!buyer_id || !seller_id || !messageInput.trim()) return;

    const ChatId =
      buyer_id < seller_id
        ? `${buyer_id}_${seller_id}_${docId}`
        : `${seller_id}_${buyer_id}_${docId}`;

    const messagesRef = collection(db, "Chats", ChatId, "messages");

    await addDoc(messagesRef, {
      sender: usermail,
      data: messageInput.trim(),
      timestamp: serverTimestamp(),
    });

    setMessageInput(""); // Clear input field after sending
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
        contentContainerStyle={{ flex: 1 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              minWidth: 250,
              maxWidth: 260,
              alignItems: "center",
            }}
          >
            <View>
              <Image
                source={{ uri: item.userimage }}
                style={{ width: 40, height: 40, borderRadius: 20 }}
              />
            </View>

            <View style={{marginTop:"10%"}}>
              <View style={{ justifyContent: "center", alignItems: "center" }}>
                <Text>Product name</Text>
              </View>
              <Text style={styles.headerTitle}>{item.name}</Text>
            </View>
          </View>
        </View>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ color: "grey" }}>
            Don't Share any sensitive information in this chat
          </Text>
        </View>

        {/* Message List */}
        <FlatList
          ref={flatListRef}
          data={messages} // The messages from Firestore
          renderItem={({ item }) => (
            <View
              style={[
                styles.messageBubble,
                item.sender === usermail
                  ? styles.myMessage
                  : styles.theirMessage,
              ]}
            >
              <Text style={styles.messageText}>{item.data}</Text>
              <Text style={styles.timeText}>
                {item.timestamp?.seconds
                  ? new Date(item.timestamp.seconds * 1000).toLocaleTimeString()
                  : "Sending..."}
              </Text>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.messagesList}
          onContentSizeChange={() => {
            if (flatListRef.current && messages.length > 0) {
              flatListRef.current.scrollToEnd({ animated: false });
            }
          }}
          onLayout={() => {
            if (flatListRef.current && messages.length > 0) {
              flatListRef.current.scrollToEnd({ animated: false });
            }
          }}
          onScrollBeginDrag={dismissKeyboard}
        />

        {/* Input Area */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            multiline
            value={messageInput}
            onChangeText={setMessageInput}
            maxHeight={100}
          />
          <TouchableOpacity
            style={styles.sendButton}
            onPress={handleSendMessage}
            disabled={!messageInput.trim()}
          >
            <Ionicons name="send" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
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
    flexGrow: 1,
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
    backgroundColor: "blue",
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
