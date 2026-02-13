import { StyleSheet, Text, View } from "react-native";

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
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    backgroundColor: "#dfdfdf",
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
  }
})
