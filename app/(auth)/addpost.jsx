import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  ToastAndroid,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
  Alert,
  Dimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import { addDoc, collection, getDocs, getFirestore } from "firebase/firestore";
import { app } from "../../firebaseconfig";
import { Formik } from "formik";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useUser } from "@clerk/clerk-expo";
import { useLocation } from "../../Context/LocationContext";
import { MaterialIcons } from "@expo/vector-icons";
import { UseTheme } from "../../Context/ThemeContext";

const { width } = Dimensions.get("window");

const Add = () => {
  const { user } = useUser();
  const { location, address, getCurrentLocation } = useLocation();
  const { Theme, commonStyles, getOppositeColor, colorShades } = UseTheme();

  const [categorylist, setCategoryList] = useState([]);
  const [Loading, SetLoading] = useState(false);
  const [image, setImage] = useState(null);
  const db = getFirestore(app);
  const storage = getStorage();

  useEffect(() => {
    getCategoryList();
    if (!location) {
      getCurrentLocation();
    }
  }, []);

  const getCategoryList = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "Categories"));
      const categories = querySnapshot.docs.map((doc) => doc.data());

      setCategoryList(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const image_submit = async (value) => {
    SetLoading(true);
    if (!image) {
      SetLoading(false);
      return ToastAndroid.show("Image is required", ToastAndroid.SHORT);
    }

    try {
      const response = await fetch(image);
      const image_blob = await response.blob();
      const storageref = ref(storage, "CommunityPost/" + Date.now() + ".jpg");

      await uploadBytes(storageref, image_blob);

      const downloadurl = await getDownloadURL(storageref);

      value.image = downloadurl;
      value.useremail = user.primaryEmailAddress.emailAddress;
      value.username = user.fullName;
      value.userimage = user.imageUrl;
      value.customId = Date.now().toString();

      if (location) {
        value.location = {
          latitude: location.latitude,
          longitude: location.longitude,
        };
      }
      if (address) {
        value.formattedAddress = address.formattedAddress;
        value.city = address.city;
        value.region = address.region;
      }

      const docref = await addDoc(collection(db, "UserPosts"), value);

      SetLoading(false);
      Alert.alert("Post Data Uploaded Successfully");
      setImage(null);
    } catch (error) {
      console.error("Error:", error);
      SetLoading(false);
      Alert.alert("Upload failed", error.message);
    }
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={[styles.scrollContainer, commonStyles.container]}
      extraScrollHeight={Platform.OS === "ios" ? 100 : 80}
      enableOnAndroid={true}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={[styles.container, commonStyles.container]}>
          <Text style={[styles.header, commonStyles.text]}>
            Create New Listing
          </Text>

          <TouchableOpacity
            onPress={pickImage}
            style={[styles.imagePickerContainer, commonStyles.card]}
          >
            {image ? (
              <Image source={{ uri: image }} style={styles.selectedImage} />
            ) : (
              <View
                style={[
                  styles.imagePlaceholder,
                  Theme === "dark"
                    ? { borderColor: colorShades.whiteShades.ghostWhite }
                    : null,
                ]}
              >
                <MaterialIcons
                  name="add-a-photo"
                  size={40}
                  color={getOppositeColor(colorShades, "jet", "white")}
                />
                <Text style={[styles.imagePlaceholderText, commonStyles.text]}>
                  Add Photos
                </Text>
              </View>
            )}
          </TouchableOpacity>

          <Formik
            initialValues={{
              title: "",
              name: "",
              desc: "",
              category: "Furniture",
              address: address ? address.formattedAddress : "",
              image: "",
              seller_name: "",
              useremail: "",
              price: "",
              sellerimage: "",
            }}
            onSubmit={(values, { resetForm }) => {
              if (
                !values.title ||
                !values.name ||
                !values.desc ||
                !values.category ||
                !values.price ||
                !values.address
              ) {
                ToastAndroid.show(
                  "All Fields are Required",
                  ToastAndroid.SHORT
                );
              } else {
                image_submit(values);
                resetForm();
              }
            }}
            // validate={(values) => {
            //   const err = {};
            //   if (
            //     !values.title ||
            //     !values.name ||
            //     !values.desc ||
            //     !values.category ||
            //     !values.price ||
            //     !values.address
            //   ) {
            //     ToastAndroid.show(
            //       "All Fields are Required",
            //       ToastAndroid.SHORT
            //     );
            //   }
            //   return err;
            // }}
          >
            {({ handleChange, handleBlur, handleSubmit, values }) => (
              <View style={styles.formContainer}>
                <View style={styles.inputGroup}>
                  <Text style={[styles.label, commonStyles.text]}>Title</Text>
                  <TextInput
                    style={[
                      styles.input,
                      commonStyles.input,
                      Theme === "dark"
                        ? { borderColor: colorShades.whiteShades.ghostWhite }
                        : null,
                    ]}
                    placeholder="Enter listing title"
                    value={values.title}
                    onChangeText={handleChange("title")}
                    placeholderTextColor={
                      Theme === "dark"
                        ? colorShades.whiteShades.ghostWhite + "80"
                        : getOppositeColor(colorShades, "dimGray", "dimGray")
                    }
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={[styles.label, commonStyles.text]}>Name</Text>
                  <TextInput
                    style={[
                      styles.input,
                      commonStyles.input,
                      Theme === "dark"
                        ? { borderColor: colorShades.whiteShades.ghostWhite }
                        : null,
                    ]}
                    placeholder="Your name"
                    value={values.name}
                    onChangeText={handleChange("name")}
                    placeholderTextColor={
                      Theme === "dark"
                        ? colorShades.whiteShades.ghostWhite + "80"
                        : getOppositeColor(colorShades, "dimGray", "dimGray")
                    }
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={[styles.label, commonStyles.text]}>
                    Description
                  </Text>
                  <TextInput
                    style={[
                      styles.input,
                      commonStyles.input,
                      { height: 100 },
                      Theme === "dark"
                        ? { borderColor: colorShades.whiteShades.ghostWhite }
                        : null,
                    ]}
                    placeholder="Describe your item"
                    value={values.desc}
                    onChangeText={handleChange("desc")}
                    multiline
                    numberOfLines={4}
                    placeholderTextColor={
                      Theme === "dark"
                        ? colorShades.whiteShades.ghostWhite + "80"
                        : getOppositeColor(colorShades, "dimGray", "dimGray")
                    }
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={[styles.label, commonStyles.text]}>
                    Category
                  </Text>
                  <View
                    style={[
                      styles.pickerContainer,
                      commonStyles.input,
                      Theme === "dark"
                        ? { borderColor: colorShades.whiteShades.ghostWhite }
                        : null,
                    ]}
                  >
                    <Picker
                      selectedValue={values.category}
                      onValueChange={handleChange("category")}
                      style={[
                        styles.picker,
                        { color: getOppositeColor(colorShades) },
                      ]}
                      dropdownIconColor={getOppositeColor(colorShades)}
                    >
                      {categorylist.map((item, index) => (
                        <Picker.Item
                          key={index}
                          label={item.Name}
                          value={item.Name}
                          // color={Theme === "dark" ? "white" : "black"}
                          
                        />
                      ))}
                    </Picker>
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={[styles.label, commonStyles.text]}>Price</Text>
                  <TextInput
                    style={[
                      styles.input,
                      commonStyles.input,
                      Theme === "dark"
                        ? { borderColor: colorShades.whiteShades.ghostWhite }
                        : null,
                    ]}
                    placeholder="Enter price"
                    value={values.price}
                    onChangeText={handleChange("price")}
                    keyboardType="numeric"
                    placeholderTextColor={
                      Theme === "dark"
                        ? colorShades.whiteShades.ghostWhite + "80"
                        : getOppositeColor(colorShades, "dimGray", "dimGray")
                    }
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={[styles.label, commonStyles.text]}>
                    Location
                  </Text>
                  <TextInput
                    style={[
                      styles.input,
                      commonStyles.input,
                      Theme === "dark"
                        ? { borderColor: colorShades.whiteShades.ghostWhite }
                        : null,
                    ]}
                    placeholder="Enter location"
                    value={values.address}
                    onChangeText={handleChange("address")}
                    placeholderTextColor={
                      Theme === "dark"
                        ? colorShades.whiteShades.ghostWhite + "80"
                        : getOppositeColor(colorShades, "dimGray", "dimGray")
                    }
                  />
                </View>

                <TouchableOpacity
                  style={[
                    styles.submitButton,
                    { opacity: Loading ? 0.7 : 1 },
                    Theme === "dark" ? { backgroundColor: "#4A90E2" } : null,
                  ]}
                  onPress={handleSubmit}
                  disabled={Loading}
                >
                  {Loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.submitButtonText}>Create Listing</Text>
                  )}
                </TouchableOpacity>
              </View>
            )}
          </Formik>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  imagePickerContainer: {
    width: width - 40,
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
    overflow: "hidden",
  },
  selectedImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  imagePlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#6c47ff",
    borderStyle: "dashed",
    borderRadius: 10,
  },
  imagePlaceholderText: {
    marginTop: 10,
    fontSize: 16,
  },
  formContainer: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
  },
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 8,
    overflow: "hidden",
  },
  picker: {
    height: 50,
    width: "100%",
  },
  submitButton: {
    backgroundColor: "#6c47ff",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Add;
