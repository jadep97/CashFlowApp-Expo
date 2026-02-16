import Entypo from '@expo/vector-icons/Entypo';
import { Drawer } from "expo-router/drawer";
import { Pressable, Text } from "react-native";
import HeaderMenu from '../components/layout/headerMenu';

function MenuButton({ navigation }: { navigation: any }) {
  return (
    <Pressable
      onPress={() => navigation.toggleDrawer()}
      style={{ marginLeft: 15 }}
    >
      <Text><Entypo name="menu" size={24} color="blue" /></Text>
    </Pressable>
  );
}

export default function RootLayout() {
  return (
    <Drawer
      screenOptions={{
        headerTitle: "Cash Flow App",
      }}

    >
      <Drawer.Screen
        name="home"
        options={({ navigation }) => ({
          headerLeft: () => <HeaderMenu navigation={navigation} />,
          title: "Home"
        })}
      />
      {/* <Drawer.Screen name="Settings" options={{ title: "Settings" }} />
      <Drawer.Screen name="Profile" options={{ title: "Profile" }} /> */}
    </Drawer>
  );
}
