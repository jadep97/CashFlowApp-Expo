import { Drawer } from "expo-router/drawer";
import { PaperProvider } from "react-native-paper";
import HeaderMenu from "../components/layout/headerMenu";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
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
              title: "Home",
            })}
          />
        </Drawer>
      </PaperProvider>
    </QueryClientProvider>
  );
}
