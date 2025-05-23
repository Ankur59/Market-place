// components/RoleBasedRedirect.tsx
import { useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { useEffect } from "react";

export default function RoleBasedRedirect() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    // Wait for user data to load
    if (!isLoaded || !user) return;

    // Get role from Clerk's public metadata
    const userRole = user?.publicMetadata?.role;

    // Redirect based on role
    if (userRole === "admin") {
      router.replace("/(admin)/dashboard");
    } else {
      // Default redirect for regular users
      router.replace("../(auth)/home");
    }
  }, [isLoaded, user, router]);

  // Return null while handling redirect
  return null;
}
