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
  ActivityIndicator,
  Alert,
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
import { v4 as uuidv4 } from "uuid";

const Add = () => {
  const { user } = useUser();

  const [categorylist, setCategoryList] = useState([]); //State to storeee all the categorynames fetched from fireebase
  const [Loading, SetLoading] = useState(false);

  const [image, setImage] = useState(null); //State to store the selected image from the user
  const db = getFirestore(app); //Initialize firestore database
  const storage = getStorage(); //Initialize Storage

  useEffect(() => {
    getCategoryList();
  }, []);

  const getCategoryList = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "Categories"));
      const categories = querySnapshot.docs.map((doc) => doc.data());

      setCategoryList(categories); // Update state once, after collecting all data
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };
  //Component to open image picker
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    //If image is selected successfully then it will be stored to the Image state
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

      // Upload the image
      await uploadBytes(storageref, image_blob);

      // Get the download URL
      const downloadurl = await getDownloadURL(storageref);

      // Prepare the document data
      value.image = downloadurl;
      value.useremail = user.primaryEmailAddress.emailAddress;
      value.username = user.fullName;
      value.userimage = user.imageUrl;
      value.customId = Date.now().toString();

      // Add document to Firestore
      const docref = await addDoc(collection(db, "UserPosts"), value);

      // Success!
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
              id: "",
              desc: "",
              category: "Furniture",
              address: "",
              image: "",
              username: "",
              useremail: "",
              price: "",
              userimage: "",
            }}
            onSubmit={(values, { resetForm }) => {
              image_submit(values);
              resetForm();
            }}
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
                            value={Item.Name}
                            label={Item.Name}
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
                  disabled={Loading}
                >
                  {Loading ? (
                    <ActivityIndicator color={"white"} />
                  ) : (
                    <Text style={Styles.submitButtonText}>Submit Listing</Text>
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
