import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

export default function OnboardingStepOne() {

    const handleContinue = () => {
        router.push("/(root)/onboarding/step-2");
      };
    
      const handleSkip = () => {
        router.replace("/(root)/(auth)/sign-in");
      };

    return (
        <SafeAreaView className="flex-1">
            <View className="flex-1 bg-white px-6">
                {/* Skip */}
            <View className="flex-row justify-end pt-5">
                <TouchableOpacity onPress={handleSkip}>
                <Text className="font-semibold text-slate-500">
                    Skip
                </Text>
                </TouchableOpacity>
            </View>
                <View className="flex-1 items-center justify-center">
                  <View className="h-48 w-48 bg-blue-100 items-center justify-center rounded-full">
                    <Text className="text-7xl font-bold text-blue-600">
                        ✓
                     </Text>
                    </View>

                    {/* Title */}
                    <Text className="mt-10 text-3x1 text-center font-bold text-slate-900">
                        Track your activities
                    </Text>

                    {/* Description */}
                    <Text className="mt-4 text-base text-center leading-6 text-slate-600">
                    Keep track of your daily activities and stay organized.
                    Tracker helps you record what you do and monitor your
                    progress.
                    </Text>
                </View>
                {/* Pagination */}
                <View className="mb-8 flex-row justify-center">
                    <View className="mx-1 h-2 w-8 rounded-full bg-blue-600" />
                      <View className="mx-1 h-2 w-2 rounded-full bg-slate-300" />
                    <View className="mx-1 h-2 w-2 rounded-full bg-slate-300" />
                </View>

                {/* Button */}
                <TouchableOpacity 
                className="mb-10 h-14 items-center justify-center rounded-xl bg-blue-600"
                onPress={handleContinue}
                >
                    <Text className="text-base font-bold text-white">Continue</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}
