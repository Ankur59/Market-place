import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
} from "react-native";
import { useUser } from "@clerk/clerk-expo";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import ProductCard from "../../components/Card";
import EditModal from "../../components/Modal/EditModal";
import { wp } from "../../common/helper";
import { getStorage, ref } from "firebase/storage";

export default function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [Data, setData] = useState({});
  const db = getFirestore();
  const { user, isLoaded } = useUser();

  useEffect(() => {
    loadProducts();
  }, []);

  const CheckOwner = () => {
    if (user?.publicMetadata?.role == "admin") {
      return true;
    } else {
      return false;
    }
  };
  const loadProducts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "UserPosts"));
      // const productsCollection = collection(db, "UserPosts");
      // const productSnapshot = await getDocs(productsCollection);
      const productList = querySnapshot.docs.map((doc) => ({
        docId: doc.id,
        ...doc.data(),
      }));
      setProducts(productList);
    } catch (error) {
      console.error("Error loading products:", error);
      Alert.alert("Error", "Failed to load products");
    } finally {
      setLoading(false);
    }
  };
  const getPathFromURL = (url) => {
    const decodedUrl = decodeURIComponent(url);
    const match = decodedUrl.match(/\/o\/(.*?)\?/);
    return match ? match[1] : null;
  };
  const handleEdit = (item) => {
    setData({
      desc: item.desc,
      name: item.title,
      price: item.price,
    });
    setModalVisible(true);
    return Data;
  };

  console.log(products);

  const handledelete = async (item) => {
    Alert.alert(
      "Delete Post",
      "Are you sure you want to delete this post?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              // Delete Firestore document
              const docRef = doc(db, "UserPosts", item.docId);
              await deleteDoc(docRef);

              // Delete the image from storage
              const imagePath = getPathFromURL(item.image);
              if (imagePath) {
                const storage = getStorage();
                const imageRef = ref(storage, imagePath);
                await deleteObject(imageRef);
              }

              // Refresh data
              GetPostsData();
              console.log("Post and image deleted");
            } catch (error) {
              console.error("Error deleting post or image:", error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleSubmit = async (item) => {
    Alert.alert(
      "Update Post",
      "Are you sure you want to save the changes?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Update",
          onPress: async () => {
            try {
              setLoading(true); // Show loading during update
              const docRef = doc(db, "UserPosts", item.docId);
              await updateDoc(docRef, {
                title: Data.name, // Note: you're storing as 'name' but displaying as 'title'
                desc: Data.desc,
                price: Data.price,
              });

              console.log("Document successfully updated!");
              setModalVisible(false);

              // Ensure the update completes before refetching
              await loadProducts();
            } catch (error) {
              console.error("Error updating document: ", error);
              Alert.alert("Error", "Failed to update product");
            } finally {
              setLoading(false);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        numColumns={2}
        data={products}
        keyExtractor={(item) => item.customId}
        renderItem={({ item }) => (
          <View>
            <ProductCard
              imageUrl={item.image}
              name={item.title}
              price={item.price}
              condition={CheckOwner(item.useremail)}
              Ondelete={() => handledelete(item)}
              onEdit={() => handleEdit(item)}
              width={wp(40)}
            />
            <EditModal
              modalVisible={modalVisible}
              setModalVisible={setModalVisible}
              item={Data}
              setitem={setData}
              onsubmit={() => handleSubmit(item)}
            />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContainer: {
    padding: 15,
  },
  productCard: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 15,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  productStatus: {
    fontSize: 12,
    fontWeight: "500",
  },
  actions: {
    flexDirection: "row",
    gap: 10,
  },
  actionButton: {
    padding: 8,
    borderRadius: 8,
  },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    color: "#666",
    marginTop: 20,
  },
});
