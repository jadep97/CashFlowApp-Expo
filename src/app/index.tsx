import { StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-paper";

export default function Index() {
  return (
    <View
      style={{
        display: "flex",
        rowGap: 10,
        width: "100%",
      }}
    >
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Total Income</Text>
        <Text style={styles.subTitle}>₱100,000.00</Text>
      </View>
      <View style={styles.buttonContainer}>
        <Button icon={"cash-plus"} mode="outlined" onPress={() => console.log('Pressed')}>Cash In</Button>
        <Button icon={"cash-minus"} mode="outlined" onPress={() => console.log('Pressed')}>Cash Out</Button>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    backgroundColor: "#72a976",
    paddingBlock: 30,
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  title: {
    fontSize: 15,
    fontWeight: "bold"
  },
  subTitle: {
    fontSize: 20,
    fontWeight: "bold"
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    padding: 10,
    columnGap: 6
  },
  cashButton: {
    width: "100%"
  }
})
