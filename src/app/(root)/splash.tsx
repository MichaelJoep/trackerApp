import { useEffect } from "react";
import {
    ActivityIndicator,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

export default function SplashSceen() {
    useEffect(() => {
        const timer = setTimeout(() => {
          router.replace("/(root)/onboarding/step-1");
        }, 2500);
    
        return () => clearTimeout(timer);
      }, []);

    return (
        <SafeAreaView className="flex-1 bg-blue-600">
            <View className="flex-1 items-center justify-center bg-blue-600">
                <View className="h-24 w-24 items-center justify-center rounded-3xl bg-white">
                    <Text className="text-4xl font-bold text-blue-600">
                        T
                    </Text>
             </View>

                <Text className="mt-6 text-3xl font-bold text-white">
                    Tracker
                 </Text>

                <Text className="mt-2 text-base text-blue-100">
                    Track. Improve. Achieve.
                </Text>

                <ActivityIndicator
                    size="small"
                    color="#FFFFFF"
                    className="mt-10"
                />
            </View>
        </SafeAreaView>
    )
}
