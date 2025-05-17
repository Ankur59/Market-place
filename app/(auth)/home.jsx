import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import ProfileHeader from "../../components/ProfileHeader";
import Slider from "../../components/Slider";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { app } from "../../firebaseconfig";
import Category from "../../components/Categories";
import LatestItems from "../../components/LatestItems";
import { useAuth } from "../../Context/DataContext";
import ErrorOverlay from "../../components/ErrorOverlay";

const Home = () => {
  const { Posts, GetPostsData, GetCategoryData, Categories } = useAuth();
  const db = getFirestore(app);

  const [Slider_Img, SetSlider_Img] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getsliderimage = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "Sliders"));
      const Slider = querySnapshot.docs.map((doc) => doc.data());
      SetSlider_Img(Slider);
      return true;
    } catch (error) {
      setError("Failed to load slider images. " + error.message);
      return false;
    }
  };

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError(null);

      const results = await Promise.all([
        getsliderimage(),
        GetCategoryData(),
        GetPostsData(),
      ]);

      const hasError = results.some((result) => result === false);
      if (hasError) {
        throw new Error("Failed to load some data");
      }
    } catch (error) {
      setError(
        "Failed to load content. Please check your internet connection and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const handleRetry = () => {
    loadInitialData();
  };

  if (error) {
    return <ErrorOverlay error={error} onRetry={handleRetry} />;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {loading ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color="#6c47ff" />
          <Text style={{ marginTop: 10, textAlign: "center" }}>
            Loading your content...{"\n"}Please wait
          </Text>
        </View>
      ) : (
        <ScrollView>
          <ProfileHeader />
          <Slider source={Slider_Img} />
          <Category source={Categories} />
          <LatestItems source={Posts} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default Home;
