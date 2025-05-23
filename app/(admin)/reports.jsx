import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { Ionicons } from "@expo/vector-icons";

export default function Reports() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    activeProducts: 0,
    totalCategories: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const db = getFirestore();

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      // Get users count
      const usersSnapshot = await getDocs(collection(db, "users"));
      const totalUsers = usersSnapshot.size;

      // Get products stats
      const productsSnapshot = await getDocs(collection(db, "UserPosts"));
      const totalProducts = productsSnapshot.size;
      const activeProducts = productsSnapshot.docs.filter(
        (doc) => doc.data().status === "active"
      ).length;

      // Get categories count
      const categoriesSnapshot = await getDocs(collection(db, "Categories"));
      const totalCategories = categoriesSnapshot.size;

      // Get recent activity (last 10 products)
      const recentProductsQuery = query(
        collection(db, "products")
        // Add where clause if you have a timestamp field
        // where('createdAt', '>', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
      );
      const recentProductsSnapshot = await getDocs(recentProductsQuery);
      const recentActivity = recentProductsSnapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
          type: "product",
        }))
        .slice(0, 10);

      setStats({
        totalUsers,
        totalProducts,
        activeProducts,
        totalCategories,
      });
      setRecentActivity(recentActivity);
    } catch (error) {
      console.error("Error loading stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, color }) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <View style={styles.statIcon}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <View style={styles.statInfo}>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statTitle}>{title}</Text>
      </View>
    </View>
  );

  const ActivityItem = ({ item }) => (
    <View style={styles.activityItem}>
      <View style={[styles.activityIcon, { backgroundColor: "#2563eb" }]}>
        <Ionicons name="cube" size={20} color="white" />
      </View>
      <View style={styles.activityInfo}>
        <Text style={styles.activityTitle}>
          {item.title || "Untitled Product"}
        </Text>
        <Text style={styles.activityMeta}>
          Price: ₹{item.price || "0"} • Status: {item.status || "active"}
        </Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Overview</Text>
        <View style={styles.statsGrid}>
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            icon="people"
            color="#2563eb"
          />
          <StatCard
            title="Total Products"
            value={stats.totalProducts}
            icon="cube"
            color="#10b981"
          />
          <StatCard
            title="Categories"
            value={stats.totalCategories}
            icon="list"
            color="#8b5cf6"
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <View style={styles.activityList}>
          {recentActivity.map((item, index) => (
            <ActivityItem key={item.id || index} item={item} />
          ))}
          {recentActivity.length === 0 && (
            <Text style={styles.emptyText}>No recent activity</Text>
          )}
        </View>
      </View>

      <TouchableOpacity
        style={styles.refreshButton}
        onPress={() => {
          setLoading(true);
          loadStats();
        }}
      >
        <Ionicons name="refresh" size={20} color="white" />
        <Text style={styles.refreshButtonText}>Refresh Data</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  section: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#1f2937",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  statCard: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    width: "48%",
    flexDirection: "row",
    alignItems: "center",
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statIcon: {
    marginRight: 10,
  },
  statInfo: {
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1f2937",
  },
  statTitle: {
    fontSize: 14,
    color: "#6b7280",
  },
  activityList: {
    backgroundColor: "white",
    borderRadius: 10,
    overflow: "hidden",
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  activityMeta: {
    fontSize: 14,
    color: "#6b7280",
  },
  emptyText: {
    textAlign: "center",
    padding: 20,
    color: "#6b7280",
  },
  refreshButton: {
    backgroundColor: "#2563eb",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    borderRadius: 10,
    margin: 15,
    gap: 10,
  },
  refreshButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
