import { Ionicons } from "@expo/vector-icons";
import { TextInput, View } from "react-native";

export function SearchBar() {
  return (
    <View className="flex-row items-center rounded-2xl bg-white px-4 py-3 border border-slate-100 shadow-sm shadow-slate-200/50">
      <Ionicons name="search-outline" size={20} color="#94A3B8" />
      <TextInput
        className="flex-1 ml-3 text-sm text-slate-800 placeholder:text-slate-400 p-0"
        placeholder="Search by username..."
        placeholderTextColor="#94A3B8"
      />
      <Ionicons name="options-outline" size={20} color="#64748B" />
    </View>
  );
}
