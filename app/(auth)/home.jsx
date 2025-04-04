import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import ProfileHeader from "../../components/ProfileHeader";
import Slider from "../../components/Slider";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { app } from "../../firebaseconfig";

const Home = () => {
  const db = getFirestore(app);
  const [Slider_Img, SetSlider_Img] = useState([]);

  const getsliderimage = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "Sliders"));
      const categories = querySnapshot.docs.map((doc) => doc.data());

      SetSlider_Img(categories); // Update state once, after collecting all data
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    getsliderimage();
  }, []);

  console.log(Slider_Img);
  return (
    <View>
      <ProfileHeader />
      <Slider source={Slider_Img} />
    </View>
  );
};

export default Home;
