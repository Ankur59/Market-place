import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Share,
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useRoute } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import { useUser } from "@clerk/clerk-expo";
import { Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { UseTheme } from "../Context/ThemeContext";
import ImageView from "react-native-image-viewing";
import { db } from "../firebaseconfig";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

const ProductDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { item } = route.params;
  const { user, isLoaded } = useUser();
  const { Theme, commonStyles, getOppositeColor, colorShades } = UseTheme();
  const [Visible, SetVisible] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedReportOption, setSelectedReportOption] = useState(null);
  const [otherReasonText, setOtherReasonText] = useState("");
  const [Reported, SetReported] = useState(false);
  // Report options
  const reportOptions = [
    "Inappropriate Content",
    "Fake Product",
    "Misleading Information",
    "Spam",
    "Prohibited Item",
    "Other",
  ];

  // State to store share message and loading state
  const [shareMessage, setShareMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Generate the share message when the component mounts
  useEffect(() => {
    const msg = `Take a look at this amazing product ${item.name} I found at Havensmart: ${item.desc}`;
    setShareMessage(msg);
  }, []);

  // Handle report submission
  const handleReport = async () => {
    SetReported(true);
    if (!selectedReportOption) {
      Alert.alert("Error", "Please select a reason for reporting");
      return;
    }

    if (selectedReportOption === "Other" && !otherReasonText.trim()) {
      Alert.alert("Error", "Please provide details for your report");
      return;
    }

    try {
      const reportsRef = collection(db, "Reports");
      await addDoc(reportsRef, {
        productId: item.docId,
        productTitle: item.title,
        reportedBy: user.primaryEmailAddress?.emailAddress,
        reportReason:
          selectedReportOption === "Other"
            ? `Other: ${otherReasonText.trim()}`
            : selectedReportOption,
        timestamp: serverTimestamp(),
        sellerEmail: item.useremail,
      });

      Alert.alert(
        "Report Submitted",
        "Thank you for your report. We will review it shortly.",
        [
          {
            text: "OK",
            onPress: () => {
              SetReported(false);
              setShowReportModal(false);
              setSelectedReportOption(null);
              setOtherReasonText("");
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert("Error", "Failed to submit report. Please try again later.");
      console.error("Error submitting report:", error);
    }
  };

  const closeReportModal = () => {
    setShowReportModal(false);
    setSelectedReportOption(null);
    setOtherReasonText("");
  };

  // Share function triggered when the share button is clicked
  const Customshare = async () => {
    if (!shareMessage.trim()) {
      alert("Message not ready to share.");
      return;
    }

    try {
      setLoading(true);
      await Share.share({ message: shareMessage });
    } catch (error) {
      alert("Something went wrong while sharing.");
      console.error("Error sharing:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleContactSeller = () => {
    Alert.alert(
      "Start Chat",
      "Are you sure that you want to chat with this seller?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => {
            navigation.navigate("ChatScreen", {
              SellerId: item.useremail,
              item: item,
              buyerId: user.primaryEmailAddress?.emailAddress,
            });
          },
        },
      ]
    );
  };

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: Theme === "dark" ? "#121212" : "#fff" },
      ]}
    >
      <View>
        <ImageView
          images={[{ uri: item.image }]}
          imageIndex={0}
          visible={Visible}
          animationType="slide"
          onRequestClose={() => SetVisible(false)}
        />
        <TouchableOpacity onPress={() => SetVisible(true)}>
          <Image source={{ uri: item.image }} style={styles.image} />
        </TouchableOpacity>
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity
            style={[
              styles.iconButton,
              { backgroundColor: Theme === "dark" ? "#2C3E50" : "white" },
            ]}
            onPress={Customshare}
            disabled={loading}
          >
            <Feather
              name="share-2"
              size={24}
              color={
                Theme === "dark" ? colorShades.whiteShades.ghostWhite : "black"
              }
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.iconButton,
              { backgroundColor: Theme === "dark" ? "#2C3E50" : "white" },
            ]}
            onPress={() => setShowReportModal(true)}
          >
            <MaterialIcons name="report" size={24} color="red" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Report Modal */}
      <Modal
        visible={showReportModal}
        transparent={true}
        animationType="slide"
        onRequestClose={closeReportModal}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalOverlay}
        >
          <View
            style={[
              styles.modalContent,
              {
                backgroundColor: Theme === "dark" ? "#1a1a1a" : "#fff",
              },
            ]}
          >
            <ScrollView bounces={false}>
              <Text
                style={[
                  styles.modalTitle,
                  {
                    color:
                      Theme === "dark"
                        ? colorShades.whiteShades.ghostWhite
                        : "#000",
                  },
                ]}
              >
                Report Post
              </Text>
              <View style={styles.optionsContainer}>
                {reportOptions.map((option, index) => (
                  <Pressable
                    key={index}
                    style={[
                      styles.reportOption,
                      {
                        backgroundColor:
                          Theme === "dark" ? "#2C3E50" : "#f0f0f0",
                        borderColor:
                          selectedReportOption === option
                            ? Theme === "dark"
                              ? "#4A90E2"
                              : "#6c47ff"
                            : "transparent",
                        borderWidth: 2,
                      },
                    ]}
                    onPress={() => {
                      setSelectedReportOption(option);
                      if (option !== "Other") {
                        setOtherReasonText("");
                      }
                    }}
                  >
                    <View style={styles.radioContainer}>
                      <View style={styles.radioOuter}>
                        {selectedReportOption === option && (
                          <View
                            style={[
                              styles.radioInner,
                              {
                                backgroundColor:
                                  Theme === "dark" ? "#4A90E2" : "#6c47ff",
                              },
                            ]}
                          />
                        )}
                      </View>
                      <Text
                        style={[
                          styles.reportOptionText,
                          {
                            color:
                              Theme === "dark"
                                ? colorShades.whiteShades.ghostWhite
                                : "#000",
                          },
                        ]}
                      >
                        {option}
                      </Text>
                    </View>
                  </Pressable>
                ))}
              </View>

              {selectedReportOption === "Other" && (
                <View style={styles.otherReasonContainer}>
                  <Text
                    style={[
                      styles.otherReasonLabel,
                      {
                        color:
                          Theme === "dark"
                            ? colorShades.whiteShades.ghostWhite
                            : "#000",
                      },
                    ]}
                  >
                    Please describe your reason:
                  </Text>
                  <TextInput
                    style={[
                      styles.otherReasonInput,
                      {
                        backgroundColor: Theme === "dark" ? "#1E2A38" : "#fff",
                        color: Theme === "dark" ? "#fff" : "#000",
                        borderColor: Theme === "dark" ? "#4A90E2" : "#6c47ff",
                      },
                    ]}
                    placeholder="Type your reason here..."
                    placeholderTextColor={Theme === "dark" ? "#A0AEC0" : "#666"}
                    value={otherReasonText}
                    onChangeText={setOtherReasonText}
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                  />
                </View>
              )}
            </ScrollView>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[
                  styles.modalButton,
                  styles.cancelButton,
                  {
                    backgroundColor: Theme === "dark" ? "#2C3E50" : "#e0e0e0",
                  },
                ]}
                onPress={closeReportModal}
              >
                <Text
                  style={[
                    styles.modalButtonText,
                    {
                      color:
                        Theme === "dark"
                          ? colorShades.whiteShades.ghostWhite
                          : "#000",
                    },
                  ]}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modalButton,
                  styles.reportButton,
                  {
                    backgroundColor: Theme === "dark" ? "#4A90E2" : "#6c47ff",
                    opacity:
                      selectedReportOption &&
                      (selectedReportOption !== "Other" ||
                        otherReasonText.trim())
                        ? 1
                        : 0.6,
                  },
                ]}
                onPress={handleReport}
                disabled={Reported}
              >
                <Text style={styles.reportButtonText}>Report</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <View
        style={[
          styles.content,
          { backgroundColor: Theme === "dark" ? "#121212" : "#fff" },
        ]}
      >
        <View style={styles.header}>
          <Text
            style={[
              styles.title,
              {
                color:
                  Theme === "dark"
                    ? colorShades.whiteShades.ghostWhite
                    : "#000",
              },
            ]}
          >
            {item.title}
          </Text>
          <Text
            style={[
              styles.price,
              { color: Theme === "dark" ? "#4A90E2" : "#6c47ff" },
            ]}
          >
            ₹{item.price}
          </Text>
        </View>

        <View style={styles.section}>
          <Text
            style={[
              styles.sectionTitle,
              {
                color:
                  Theme === "dark"
                    ? colorShades.whiteShades.ghostWhite
                    : "#333",
              },
            ]}
          >
            Description
          </Text>
          <Text
            style={[
              styles.description,
              {
                color:
                  Theme === "dark"
                    ? colorShades.whiteShades.ghostWhite + "CC"
                    : "#666",
              },
            ]}
          >
            {item.desc}
          </Text>
        </View>

        <View style={styles.section}>
          <Text
            style={[
              styles.sectionTitle,
              {
                color:
                  Theme === "dark"
                    ? colorShades.whiteShades.ghostWhite
                    : "#333",
              },
            ]}
          >
            Seller Information
          </Text>
          <Text
            style={[
              styles.sellerName,
              {
                color:
                  Theme === "dark"
                    ? colorShades.whiteShades.ghostWhite
                    : "#000",
              },
            ]}
          >
            {item.name}
          </Text>
          <View style={styles.locationContainer}>
            <Ionicons
              name="location"
              size={16}
              color={
                Theme === "dark"
                  ? colorShades.whiteShades.ghostWhite + "99"
                  : "#666"
              }
            />
            <Text
              style={[
                styles.location,
                {
                  color:
                    Theme === "dark"
                      ? colorShades.whiteShades.ghostWhite + "99"
                      : "#666",
                },
              ]}
            >
              {item.address}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.contactButton,
            { backgroundColor: Theme === "dark" ? "#4A90E2" : "#6c47ff" },
          ]}
          onPress={handleContactSeller}
        >
          <Text style={styles.contactButtonText}>Contact Seller</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
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
    marginLeft: 4,
  },
  contactButton: {
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
  actionButtonsContainer: {
    position: "absolute",
    top: 10,
    right: 10,
    flexDirection: "row",
    gap: 10,
  },
  iconButton: {
    backgroundColor: "white",
    padding: 5,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  optionsContainer: {
    marginBottom: 15,
  },
  otherReasonContainer: {
    marginBottom: 15,
    paddingBottom: Platform.OS === "ios" ? 100 : 20,
  },
  otherReasonLabel: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
  },
  otherReasonInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    minHeight: 100,
    fontSize: 16,
    textAlignVertical: "top",
  },
  reportOption: {
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  radioOuter: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#6c47ff",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  radioInner: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: "#6c47ff",
  },
  reportOptionText: {
    fontSize: 16,
    flex: 1,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    gap: 10,
  },
  modalButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#e0e0e0",
  },
  reportButton: {
    backgroundColor: "#6c47ff",
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  reportButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default ProductDetails;
