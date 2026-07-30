import { Alert, Platform, ToastAndroid } from "react-native";

export const toast = {
  success: (message: string, title = "Success") => {
    if (Platform.OS === "android") {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      Alert.alert(title, message);
    }
  },
  error: (message: string, title = "Error") => {
    if (Platform.OS === "android") {
      ToastAndroid.show(message, ToastAndroid.LONG);
    } else {
      Alert.alert(title, message);
    }
  },
};
