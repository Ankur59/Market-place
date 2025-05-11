import { View, Text, ScrollView, SafeAreaView } from "react-native";
import React, { useEffect, useState } from "react";
import ProfileHeader from "../../components/ProfileHeader";
import Slider from "../../components/Slider";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { app } from "../../firebaseconfig";
import Category from "../../components/Categories";
import LatestItems from "../../components/LatestItems";
import { useAuth } from "../../Context/DataContext";

const Home = () => {
  const { Posts, GetPostsData, GetCategoryData, Categories } = useAuth();
  const db = getFirestore(app);

  const [Slider_Img, SetSlider_Img] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [Loading, setLoading] = useState(false);

  const getsliderimage = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "Sliders"));
      const Slider = querySnapshot.docs.map((doc) => doc.data());

      SetSlider_Img(Slider);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    getsliderimage();
    GetCategoryData();
    GetPostsData();
  }, []);

  useEffect(() => {
    if (Categories.length < 0 && Slider_Img.length < 0) {
      {
        setLoading(true);
      }
    } else {
      setLoading(false);
    }
  }, [Categories]);
  return (
    <SafeAreaView>
      <ScrollView>
        {Loading && (
          <View style={{ flex: 1, justifyContent: "center" }}>
            <ActivityIndicator size="large" color="red" />
          </View>
        )}
        <ProfileHeader />
        <Slider source={Slider_Img} />
        <Category source={Categories} />
        <LatestItems source={Posts} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
