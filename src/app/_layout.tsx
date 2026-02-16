import { Drawer } from "expo-router/drawer";
import { PaperProvider } from "react-native-paper";
import HeaderMenu from '../components/layout/headerMenu';

export default function RootLayout() {
  return (
    <PaperProvider>
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
    </PaperProvider>

  );
}
