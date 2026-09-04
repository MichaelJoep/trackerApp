import {
    Text,
    TouchableOpacity,
    View,
  } from "react-native";
  
  import {
    Feather,
  } from "@expo/vector-icons";
  
  import {
    Swipeable,
  } from "react-native-gesture-handler";
  
  export interface HistoryRecord {
    id: string;
    title: string;
    description: string;
    date: string;
    time: string;
    action:
      | "deleted"
      | "edited"
      | "created";
  }
  
  interface HistoryItemProps {
    item: HistoryRecord;
    onDelete: () => void;
  }
  
  function getIcon(
    action: HistoryRecord["action"],
  ) {
    switch (action) {
      case "deleted":
        return "trash-2";
  
      case "edited":
        return "edit-3";
  
      default:
        return "plus-circle";
    }
  }
  
  function getBackground(
    action: HistoryRecord["action"],
  ) {
    switch (action) {
      case "deleted":
        return "bg-red-50";
  
      case "edited":
        return "bg-amber-50";
  
      default:
        return "bg-blue-50";
    }
  }
  
  function getColor(
    action: HistoryRecord["action"],
  ) {
    switch (action) {
      case "deleted":
        return "#EF4444";
  
      case "edited":
        return "#D97706";
  
      default:
        return "#2563EB";
    }
  }
  
  function DeleteAction({
    onDelete,
  }: {
    onDelete: () => void;
  }) {
    return (
      <TouchableOpacity
        onPress={onDelete}
        activeOpacity={0.85}
        className="mb-2 ml-2 w-20 items-center justify-center"
      >
        <Feather
          name="trash-2"
          size={20}
          color="red"
        />
  
        <Text className="mt-1 text-xs font-bold text-red-400">
          Delete
        </Text>
      </TouchableOpacity>
    );
  }
  
  export default function HistoryItem({
    item,
    onDelete,
  }: HistoryItemProps) {
    return (
      <Swipeable
        renderRightActions={() => (
          <DeleteAction
            onDelete={onDelete}
          />
        )}
        overshootRight={false}
        rightThreshold={40}
      >
        <View className="mb-2 flex-row items-center rounded-2xl bg-white p-4">
          {/* Icon */}
          <View
            className={`h-11 w-11 items-center justify-center rounded-full ${getBackground(
              item.action,
            )}`}
          >
            <Feather
              name={
                getIcon(
                  item.action,
                ) as any
              }
              size={19}
              color={getColor(
                item.action,
              )}
            />
          </View>
  
          {/* Information */}
          <View className="ml-3 flex-1">
            <Text className="text-sm font-bold text-slate-900">
              {item.title}
            </Text>
  
            <Text className="mt-1 text-xs text-slate-500">
              {item.description}
            </Text>
          </View>
  
          {/* Time */}
          <View className="items-end">
            <Text className="text-[11px] text-slate-400">
              {item.date}
            </Text>
  
            <Text className="mt-1 text-[11px] text-slate-400">
              {item.time}
            </Text>
          </View>
        </View>
      </Swipeable>
    );
  }