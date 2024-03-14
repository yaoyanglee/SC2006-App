import { View, Text, Button } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@clerk/clerk-expo";

export default function ProfileScreen() {
  const SignOut = () => {
    const { isLoaded, signOut } = useAuth();
    if (!isLoaded) {
      return null;
    }
    return (
      <View>
        <Button
          title="Sign Out"
          onPress={() => {
            signOut();
          }}
        />
      </View>
    );
  };

  return (
    <SafeAreaView>
      <View>
        <SignOut />
      </View>
    </SafeAreaView>
  );
}
