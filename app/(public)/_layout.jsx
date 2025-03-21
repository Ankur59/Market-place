import React from "react";
import { Stack } from "expo-router";

const PublicLayout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="login"
        options={{
          headerTitle: "Login",
        }}
        screenOptions={{
          headerShown: true,
        }}
      ></Stack.Screen>
      <Stack.Screen
        name="register"
        options={{
          headerTitle: "Create Account",
        }}
      ></Stack.Screen>
      <Stack.Screen
        name="reset"
        options={{
          headerTitle: "Reset Password",
        }}
      ></Stack.Screen>
    </Stack>
  );
};

export default PublicLayout;
