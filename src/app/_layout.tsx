import { Drawer } from "expo-router/drawer";
import { PaperProvider } from "react-native-paper";
import HeaderMenu from "../components/layout/headerMenu";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import CustomDrawer from "../components/layout/customDrawer";

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <PaperProvider>
        <Drawer
          drawerContent={(props) => <CustomDrawer {...props} />} // custom drawer
          screenOptions={{
            headerTitle: 'Cash Flow App',
            headerLeft: () => <HeaderMenu />,
          }}
        />
      </PaperProvider>
    </QueryClientProvider>
  );
}
