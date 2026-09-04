import {
    Text,
    TouchableOpacity,
    View,
  } from "react-native";
  import { Feather } from "@expo/vector-icons";
  
  interface NotificationDropdownProps {
    onClose: () => void;
  }
  
  const notifications = [
    {
      id: "1",
      title: "Welcome to Tracker",
      message:
        "Start adding your accounts and transactions to track your finances.",
      time: "Just now",
      unread: true,
    },
    {
      id: "2",
      title: "Monthly budget",
      message:
        "Create a budget to better manage your monthly spending.",
      time: "Today",
      unread: false,
    },
  ];
  
  export default function NotificationDropdown({
    onClose,
  }: NotificationDropdownProps) {
    return (
      <View
        className="absolute right-0 top-14 z-50 w-80 rounded-2xl bg-white p-4"
        style={{
          elevation: 10,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 6,
          },
          shadowOpacity: 0.12,
          shadowRadius: 12,
        }}
      >
        {/* Header */}
        <View className="mb-3 flex-row items-center justify-between">
          <Text className="text-lg font-bold text-slate-900">
            Notifications
          </Text>
  
          <TouchableOpacity
            onPress={onClose}
            className="p-1"
          >
            <Feather
              name="x"
              size={18}
              color="#64748B"
            />
          </TouchableOpacity>
        </View>
  
        {/* Notifications */}
        {notifications.map(
          (notification) => (
            <TouchableOpacity
              key={notification.id}
              className="mb-1 flex-row rounded-xl p-3"
            >
              <View
                className={`mr-3 mt-1 h-2 w-2 rounded-full ${
                  notification.unread
                    ? "bg-blue-600"
                    : "bg-transparent"
                }`}
              />
  
              <View className="flex-1">
                <Text className="font-semibold text-slate-800">
                  {notification.title}
                </Text>
  
                <Text className="mt-1 text-xs leading-5 text-slate-500">
                  {notification.message}
                </Text>
  
                <Text className="mt-2 text-xs text-slate-400">
                  {notification.time}
                </Text>
              </View>
            </TouchableOpacity>
          ),
        )}
  
        {/* Footer */}
        <View className="mt-2 border-t border-slate-100 pt-3">
          <TouchableOpacity
            onPress={() => {
              /*
               * Notifications screen can be added later.
               */
            }}
            className="items-center py-2"
          >
            <Text className="font-semibold text-blue-600">
              View all notifications
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }