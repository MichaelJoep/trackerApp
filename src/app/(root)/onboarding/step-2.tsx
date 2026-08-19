import { Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function OnboardingStepTwo() {

    const handleContinue = () => {
        router.push("/(root)/onboarding/step-3");
    };

    const handleBack = () => {
        router.back();
    };

    const handleSkip = () => {
        router.replace("/(root)/(auth)/sign-in");
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

                    <TouchableOpacity onPress={handleSkip}>
                        <Text className="font-semibold text-slate-500">
                            Skip
                        </Text>
                    </TouchableOpacity>
                </View>
                {/* Illustration */}
                <View className="flex-1 items-center justify-center">
                    <View className="h-48 w-48 items-center justify-center rounded-full bg-green-100">
                        <Text className="text-7xl font-bold text-green-600">
                            ↗
                        </Text>
                    </View>

                    {/* Title */}
                    <Text className="mt-10 text-center text-3xl font-bold text-slate-900">
                        Understand your progress
                    </Text>

                    {/* Description */}
                    <Text className="mt-4 text-center text-base leading-6 text-slate-500">
                        See your progress clearly and understand how you're
                        improving. Track your achievements and identify areas
                        where you can do better.
                    </Text>
                 </View>

                {/* Pagination */}
                <View className="mb-8 flex-row justify-center">
                    <View className="mx-1 h-2 w-2 rounded-full bg-slate-300" />
                    <View className="mx-1 h-2 w-8 rounded-full bg-blue-600" />
                    <View className="mx-1 h-2 w-2 rounded-full bg-slate-300" />
                </View>

                {/* Button */}
                <TouchableOpacity
                    className="mb-10 h-14 items-center justify-center rounded-xl bg-blue-600"
                    onPress={handleContinue}
                >
                    <Text className="text-base font-bold text-white">
                        Continue
                   </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}
