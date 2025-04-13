import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { app } from "../firebaseconfig";
import { useUser } from "@clerk/clerk-expo";
import { FlatList } from "react-native";
import ProductCard from "../components/Card";

const Myproducts = () => {
  const [MyProducts, SetMyProducts] = useState([]);
  const [Loading, setLoading] = useState(false);
  const db = getFirestore(app);
  const { user } = useUser();

  useEffect(() => {
    GetPostsData();
  }, []);

  const GetPostsData = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "UserPosts"));
      const data = querySnapshot.docs
        .map((item) => item.data())
        .filter(
          (item) => item.useremail === user.primaryEmailAddress.emailAddress
        );

      SetMyProducts(data);
      setLoading(false);
    } catch (error) {
      console.log("Error fetching Posts:", error);
      setLoading(false);
    }
  };
  return (
    <View>
      {Loading ? (
        <View
          style={{
            height: "100%",
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <View style={styles.container}>
          <FlatList
            numColumns={2}
            data={MyProducts}
            renderItem={({ item, index }) => {
              return (
                <ProductCard
                  imageUrl={item.image}
                  name={item.name}
                  price={item.price}
                //   action={() => navigation.navigate("productDetails", { item })}
                />
              );
            }}
          />
        </View>
      )}
    </View>
  );
};

export default Myproducts;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});
