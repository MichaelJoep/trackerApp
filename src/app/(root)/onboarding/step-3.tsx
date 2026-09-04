import { Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function OnboardingStepThree() {
    const handleGetStarted = async () => {
        await AsyncStorage.setItem(
            "tracker_onboarding_completed",
            "true",
          );

          router.replace("/(auth)/sign-up");
    };

    const handleBack = () => {
        router.back();
    };

    return (
        <SafeAreaView className="flex-1">
            <View className="flex-1 bg-white px-6">
                {/* Top Navigation */}
                <View className="flex-row items-center justify-between pt-5">
                    <TouchableOpacity onPress={handleBack}>
                        <Text className="text-base font-semibold text-slate-500">
                            Back
                        </Text>
                    </TouchableOpacity>
                    <View />
                </View>
                {/* Content */}
                <View className="flex-1 items-center justify-center">
                    {/* Illustration */}
                    <View className="h-48 w-48 items-center justify-center rounded-full bg-purple-100">
                        <Text className="text-7xl font-bold text-purple-600">
                            ★
                        </Text>
                    </View>

                    {/* Title */}
                    <Text className="mt-10 text-center text-3xl font-bold text-slate-900">
                        Achieve your goals
                    </Text>

                    {/* Description */}
                    <Text className="mt-4 text-center text-base leading-6 text-slate-500">
                        Build better habits and stay focused on the things that
                        matter. Stay consistent and turn your daily activities
                        into meaningful progress.
                    </Text>
                </View>

                {/* Pagination */}
                <View className="mb-8 flex-row justify-center">
                    <View className="mx-1 h-2 w-2 rounded-full bg-slate-300" />
                    <View className="mx-1 h-2 w-2 rounded-full bg-slate-300" />
                    <View className="mx-1 h-2 w-8 rounded-full bg-blue-600" />
                </View>

                {/* Get Started */}
                <TouchableOpacity
                 onPress={handleGetStarted}
                 className="mb-10 h-14 items-center justify-center bg-blue-600 rounded-xl"
                 >
                    <Text className="text-white font-bold text-base">
                        Get Started
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}
