import { View, Text, StyleSheet, Image } from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import { useUser } from "@clerk/clerk-expo";
import { hp } from "../../common/helper";
import { RadioGroup } from "react-native-radio-buttons-group";
import { UseTheme } from "../../Context/ThemeContext";
import ProfileCards from "../../components/ProfileCards";
import Ionicons from "@expo/vector-icons/Ionicons";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import AppereanceModal from "../../components/AppereanceModal";
import { useRouter } from "expo-router";

const Profile = () => {
  const { user } = useUser();
  const [selectedId, setSelectedId] = useState("system");
  const [Visible, SetVisible] = useState(false);
  const router = useRouter();

  const redir = (value) => {
    router.push(value);
  };
  const getInitials = (firstName, lastName) => {
    const firstInitial = firstName ? firstName[0] : "";
    const lastInitial = lastName ? lastName[0] : "";
    return (firstInitial + lastInitial).toUpperCase();
  };
  const openmodal = () => {
    SetVisible(true);
  };
  const {
    Theme,
    SetTheme,
    SetLightTheme,
    SetdarkTheme,
    Pref,
    getOppositeColor,
    colorShades,
  } = UseTheme();
  useEffect(() => {
    if (selectedId === "dark") {
      // call setdark theme to set the dark theme
      SetdarkTheme();
    } else if (selectedId === "light") {
      // call setlight theme to set the light theme
      SetLightTheme();
    } else if (selectedId === "system") {
      //settheme(pref)
      SetTheme(Pref);
    }
  }, [selectedId, Pref]);
  const radioButtons = useMemo(
    () => [
      {
        id: "dark",
        label: "Dark",
        value: "option1",
        labelStyle: {
          color: Theme === "dark" ? "white" : "black",
          width: 80, // Set a fixed width (adjust as needed)
          backgroundColor: "rd",
        },
        color: Theme === "dark" ? "white" : "black",
      },
      {
        id: "light",
        label: "Light",
        value: "option2",
        color: Theme === "dark" ? "white" : "black",
        labelStyle: {
          color: Theme === "dark" ? "white" : "black",
          width: 80, // Set a fixed width (adjust as needed)
          backgroundColor: "re",
        },
      },
      {
        id: "system",
        label: "System",
        value: "option2",
        color: Theme === "dark" ? "white" : "black",
        labelStyle: {
          color: Theme === "dark" ? "white" : "black",
          width: 80,
          backgroundColor: "re",
        },
      },
    ],
    [Theme]
  );

  return (
    <View style={styles(Theme).container}>
      <View style={{ alignItems: "center" }}>
        <View style={styles(Theme).header}>
          <Image
            source={{ uri: user?.imageUrl }}
            style={{
              height: hp(11),
              width: hp(11),
              borderRadius: 100,
            }}
          />
        </View>
        <Text style={styles(Theme).name}>{user?.fullName}</Text>
        <Text style={styles(Theme).email}>
          {user?.emailAddresses[0].emailAddress}
        </Text>
      </View>

      <View style={styles(Theme).infoSection}>
        <AppereanceModal
          Visible={Visible}
          Setvisible={SetVisible}
          content={
            <View styles={{}}>
              <Text
                style={{
                  color: getOppositeColor(colorShades),
                  marginBottom: "5%",
                }}
              >
                Choose Your Preference
              </Text>
              <RadioGroup
                radioButtons={radioButtons}
                onPress={setSelectedId}
                selectedId={selectedId}
              />
            </View>
          }
        />
      </View>
      <ProfileCards
        icons={
          <Ionicons
            name="settings-sharp"
            size={20}
            color={getOppositeColor(colorShades, "jet", "white")}
          />
        }
        text={"Preferences"}
        action={openmodal}
      />
      <ProfileCards
        icons={
          <Entypo
            name="list"
            size={20}
            color={getOppositeColor(colorShades, "jet", "white")}
          />
        }
        text={"My Listings"}
        action={()=>redir("/Myproducts")}
      />
      <ProfileCards
        icons={
          <FontAwesome5
            name="box-open"
            size={20}
            color={getOppositeColor(colorShades, "jet", "white")}
          />
        }
        text={"My Orders"}
      />
    </View>
  );
};

const styles = (Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Theme === "dark" ? "#000" : "#fff",
    },
    header: {
      alignItems: "center",
      padding: 20,
      backgroundColor: Theme === "dark" ? "black" : "white",
    },
    avatarContainer: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: Theme === "dark" ? "#444" : "#6c47ff",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 10,
    },
    avatarText: {
      color: "#fff", // Keep it white for contrast
      fontSize: 36,
      fontWeight: "bold",
    },
    name: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 5,
      color: Theme === "dark" ? "#fff" : "#000",
    },
    email: {
      fontSize: 16,
      color: Theme === "dark" ? "#aaa" : "#666",
    },
    infoSection: {
      padding: 20,
    },
    infoItem: {
      flexDirection: "column",
      justifyContent: "space-between",
      paddingVertical: 15,

      borderBottomColor: Theme === "dark" ? "#333" : "#eee",
    },
    label: {
      fontSize: 16,
      color: Theme === "dark" ? "#aaa" : "#666",
    },
    value: {
      fontSize: 16,
      fontWeight: "500",
      color: Theme === "dark" ? "#fff" : "#000",
    },
  });

export default Profile;
