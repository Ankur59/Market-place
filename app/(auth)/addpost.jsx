import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  ToastAndroid,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import React, { useEffect, useState } from "react";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { app } from "../../firebaseconfig";
import { Formik } from "formik";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import supabase from "../config/supabaseClients";

const Add = () => {
  const [categorylist, setCategoryList] = useState([]);
  const [image, setImage] = useState(null);
  const db = getFirestore(app);
  const storage = getStorage();

  useEffect(() => {
    getCategoryList();
  }, []);

  const getCategoryList = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "Market-Place"));
      const categories = querySnapshot.docs.map((doc) => doc.data());

      setCategoryList(categories); // Update state once, after collecting all data
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    // console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };
  console.log(supabase);
  const image_submit = async (value) => {
    if (!image) {
      return ToastAndroid.show("Image is required", ToastAndroid.SHORT);
    } else {
      value.image = image;
      const response = await fetch(image);
      const image_blob = await response.blob();
      const storageref = ref(storage, "CommunityPost/" + Date.now() + ".jpg");
      uploadBytes(storageref, image_blob)
        .then(() => console.log("Uploaded a blob or file!"))
        .catch((error) => console.error("Upload failed:", error));
    }
  };
  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: "center",
        padding: 10,
      }}
      extraScrollHeight={Platform.OS === "ios" ? 100 : 80} // Adjust height for better visibility
      enableOnAndroid={true} // Fix for Android
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={Styles.container}>
          <Text style={Styles.header}>Add New Listing</Text>
          <TouchableOpacity
            onPress={pickImage}
            style={{ height: "10%", width: "20%", marginBottom: "2%" }}
          >
            {image ? (
              <Image
                source={{ uri: image }}
                style={{ width: "100%", height: "100%", borderRadius: 10 }}
              />
            ) : (
              <Image
                source={require("../../assets/images/place.jpg")}
                style={{ width: "100%", height: "100%", borderRadius: 10 }}
              />
            )}
          </TouchableOpacity>
          <Formik
            initialValues={{
              title: "",
              name: "",
              desc: "",
              category: "",
              address: "",
              price: "",
            }}
            onSubmit={(value) => image_submit(value)}
            validate={(values) => {
              const err = {};
              if (
                !values.title &&
                !values.name &&
                !values.desc &&
                !values.category &&
                !values.price &&
                !values.address
              ) {
                ToastAndroid.show(
                  "All Fields are Required",
                  ToastAndroid.SHORT
                );
              }
              return err;
            }}
          >
            {({ handleChange, handleBlur, handleSubmit, values }) => (
              <View style={Styles.formContainer}>
                <TextInput
                  style={Styles.input}
                  placeholder="Title"
                  value={values.title}
                  onChangeText={handleChange("title")}
                  placeholderTextColor="#666"
                />
                <TextInput
                  style={Styles.input}
                  placeholder="Name"
                  value={values.name}
                  onChangeText={handleChange("name")}
                  placeholderTextColor="#666"
                />
                <TextInput
                  style={[Styles.input, Styles.descInput]}
                  placeholder="Description"
                  value={values.desc}
                  onChangeText={handleChange("desc")}
                  multiline={true}
                  numberOfLines={3}
                  placeholderTextColor="#666"
                />
                <View style={Styles.pickerContainer}>
                  <Picker
                    selectedValue={values.category}
                    onValueChange={handleChange("category")}
                    style={Styles.picker}
                  >
                    {categorylist &&
                      categorylist.map((Item, index) => {
                        return (
                          <Picker.Item
                            key={index}
                            value={Item.name}
                            label={Item.name}
                          />
                        );
                      })}
                  </Picker>
                </View>
                <TextInput
                  style={Styles.input}
                  placeholder="Price"
                  value={values.price}
                  keyboardType="number-pad"
                  onChangeText={handleChange("price")}
                  placeholderTextColor="#666"
                />
                <TextInput
                  style={Styles.input}
                  placeholder="Address"
                  value={values.address}
                  onChangeText={handleChange("address")}
                  placeholderTextColor="#666"
                />
                <TouchableOpacity
                  style={Styles.submitButton}
                  onPress={handleSubmit}
                >
                  <Text style={Styles.submitButtonText}>Submit Listing</Text>
                </TouchableOpacity>
              </View>
            )}
          </Formik>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAwareScrollView>
  );
};

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
    color: "#333",
  },
  formContainer: {
    width: "100%",
  },
  input: {
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    width: "100%",
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  descInput: {
    height: 100,
    textAlignVertical: "top",
  },
  submitButton: {
    backgroundColor: "#6c47ff",
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  submitButtonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
  },
  picker: {
    width: "100%",
  },
});

export default Add;
