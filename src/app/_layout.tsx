import { Stack } from "expo-router";
import { Provider as PaperProvider } from 'react-native-paper';

export default function RootLayout() {
  return (
    <PaperProvider>
      <Stack screenOptions={{
        title: 'Cash Flow App',
      }} />
    </PaperProvider>

  );
}
