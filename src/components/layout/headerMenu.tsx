import Entypo from "@expo/vector-icons/Entypo";
import { useNavigation } from "@react-navigation/native";
import { Pressable } from "react-native";

export default function HeaderMenu() {
  const navigation: any = useNavigation();

  return (
    <Pressable
      onPress={() => navigation.toggleDrawer?.()}
      style={{ marginLeft: 15 }}
    >
      <Entypo name="menu" size={24} color="blue" />
    </Pressable>
  );
}
