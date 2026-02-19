import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { useRouter } from 'expo-router';
import { StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

type Routes = '/' | '/reminders' | '/stocks';

export default function CustomDrawer(props: any) {
  const router = useRouter();
  const theme = useTheme();

  const menuItems: { label: string; route: Routes }[] = [
    { label: 'Home', route: '/' },
    { label: 'Reminders', route: '/reminders' },
    { label: 'Stocks', route: '/stocks' },
  ];

  const activeRoute =
    props.state?.routeNames[props.state?.index] === 'index' ? '/' : props.state?.routeNames[props.state?.index];

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.container}>
      {menuItems.map((item) => {
        const focused = item.route === activeRoute;
        console.log({ focused })
        return (
          <DrawerItem
            key={item.route}
            label={() => <Text style={focused ? styles.activeLabel : styles.label}>{item.label}</Text>}
            style={[styles.item, focused && { backgroundColor: "#d4d4d4" }]}
            onPress={() => router.push(item.route as any)}
          />
        );
      })}
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
  },
  item: {
    borderRadius: 8,
  },
  label: {
    fontSize: 16,
    color: '#333',
  },
  activeLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
});
