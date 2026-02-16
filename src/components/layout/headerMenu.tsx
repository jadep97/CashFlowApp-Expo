import Entypo from "@expo/vector-icons/Entypo";
import { Pressable, Text } from "react-native";

const HeaderMenu = ({ navigation }: { navigation: any }) => {
    return (
        <Pressable
            onPress={() => navigation.toggleDrawer()}
            style={{ marginLeft: 15 }}
        >
            <Text><Entypo name="menu" size={24} color="blue" /></Text>
        </Pressable>
    );
}

export default HeaderMenu