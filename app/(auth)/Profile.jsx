import { View, Text, StyleSheet, Image } from "react-native";
import React from "react";
import { useUser } from "@clerk/clerk-expo";
import { hp } from "../../common/helper";

const Profile = () => {
  const { user } = useUser();

  const getInitials = (firstName, lastName) => {
    const firstInitial = firstName ? firstName[0] : "";
    const lastInitial = lastName ? lastName[0] : "";
    return (firstInitial + lastInitial).toUpperCase();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {/* <View style={styles.avatarContainer}> */}
          <Image
            source={{ uri: user?.imageUrl }}
            style={{
              height: hp(11),
              width: hp(11),
              borderRadius: 100,
            }}
          />
        {/* </View> */}
        <Text style={styles.name}>{user?.fullName}</Text>
        <Text style={styles.email}>{user?.emailAddresses[0].emailAddress}</Text>
      </View>

      <View style={styles.infoSection}>
        <View style={styles.infoItem}>
          <Text style={styles.label}>Username</Text>
          <Text style={styles.value}>{user?.username || "Not set"}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.label}>First Name</Text>
          <Text style={styles.value}>{user?.firstName || "Not set"}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.label}>Last Name</Text>
          <Text style={styles.value}>{user?.lastName || "Not set"}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#6c47ff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  avatarText: {
    color: "#fff",
    fontSize: 36,
    fontWeight: "bold",
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: "#666",
  },
  infoSection: {
    padding: 20,
  },
  infoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  label: {
    fontSize: 16,
    color: "#666",
  },
  value: {
    fontSize: 16,
    fontWeight: "500",
  },
});

export default Profile;
