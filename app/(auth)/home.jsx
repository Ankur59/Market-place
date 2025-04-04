import { View, Text, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import ProfileHeader from "../../components/ProfileHeader";
import Slider from "../../components/Slider";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { app } from "../../firebaseconfig";
import Category from "../../components/Categories";
import LatestItems from "../../components/LatestItems";

const Home = () => {
  const db = getFirestore(app);
  const [Slider_Img, SetSlider_Img] = useState([]);
  const [Categories, setCategories] = useState([]);
  const [posts, setposts] = useState([]);

  const getsliderimage = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "Sliders"));
      const Slider = querySnapshot.docs.map((doc) => doc.data());

      SetSlider_Img(Slider); // Update state once, after collecting all data
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const getcategoryimage = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "Categories"));
      const categories = querySnapshot.docs.map((doc) => doc.data());

      setCategories(categories); // Update state once, after collecting all data
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const getProductDetails = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "UserPosts"));
      const posts = querySnapshot.docs.map((item) => item.data());
      setposts(posts);
    } catch (error) {
      console.log("Error fetching Posts:", error);
    }
  };
  useEffect(() => {
    getsliderimage();
    getcategoryimage();
    getProductDetails();
  }, []);

  console.log(posts);
  return (
    <ScrollView>
      <ProfileHeader />
      <Slider source={Slider_Img} />
      <Category source={Categories} />
      <LatestItems source={posts} />
    </ScrollView>
  );
};

export default Home;
