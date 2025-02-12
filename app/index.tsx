import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  return (
    <SafeAreaView>
      <View>
        <Text className="text-yellow-500">
          Welcome to my app!
        </Text>
      </View>
    </SafeAreaView>
  );
}
