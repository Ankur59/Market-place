import { View, Text, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import ProfileHeader from "../../components/ProfileHeader";
import Slider from "../../components/Slider";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { app } from "../../firebaseconfig";
import Category from "../../components/Categories";
import LatestItems from "../../components/LatestItems";
import { useAuth } from "../../Context/DataContext";

const Home = () => {
  // Get functions and States from global context api
  const { Posts, GetPostsData, GetCategoryData, Categories } = useAuth();
  const db = getFirestore(app);
  // For storing Slider Image data
  const [Slider_Img, SetSlider_Img] = useState([]);

  // Fetching Slider Images from Firebase
  const getsliderimage = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "Sliders"));
      const Slider = querySnapshot.docs.map((doc) => doc.data());

      SetSlider_Img(Slider); // Update state once, after collecting all data
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };
  useEffect(() => {
    getsliderimage();
    GetPostsData();
    GetCategoryData();
  }, []);
  return (
    <ScrollView>
      <ProfileHeader />
      <Slider source={Slider_Img} />
      <Category source={Categories} />
      <LatestItems source={Posts} />
    </ScrollView>
  );
};

export default Home;
