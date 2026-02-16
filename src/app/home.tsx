import { supabase } from "@/supabase";
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useEffect, useState } from 'react';
import { Dimensions, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import AddTransactionModal from '../components/transaction/modal/AddTransactionModal';

export default function Index() {
  const [user, setUser] = useState<any>(null);
  const [openTransactionModal, setOpenTransactionModal] = useState<any>(false);
  const [transactionType, setTransactionType] = useState<any>(null);

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq("user_id", 1);
    console.log(data)
    if (error) {
      console.log('❌ Error:', error.message);
    } else {
      setUser(data);
    }
  };

  return (
    <>

      {openTransactionModal && (
        <AddTransactionModal
          open={openTransactionModal}
          onOpenModal={(open) => setOpenTransactionModal(open)}
          type={transactionType}
        />
      )}

      <View
        style={{
          flex: 1,
          display: "flex",
          rowGap: 10,
          width: "100%",
        }}
      >
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{user && user[0]?.lastname}&apos;s Total Income</Text>
          <Text style={styles.subTitle}>₱100,000.00</Text>
        </View>
        <View style={styles.buttonContainer}>
          <Pressable
            style={({ pressed }) => [
              styles.button,
              { opacity: pressed ? 0.6 : 1 }
            ]}
            onPress={() => {
              setOpenTransactionModal(true);
              setTransactionType(1);
            }}
          >
            <View style={styles.buttonContent}>
              <MaterialCommunityIcons name="cash-plus" size={24} color="#014eba" />
              <Text style={styles.buttonText}>Cash In</Text>
            </View>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.button,
              { opacity: pressed ? 0.6 : 1 }
            ]}
            onPress={() => {
              setOpenTransactionModal(true);
              setTransactionType(2);
            }}
          >
            <View style={styles.buttonContent}>
              <MaterialCommunityIcons name="cash-minus" size={24} color="#d62d2d" />
              <Text style={styles.buttonText}>Cash Out</Text>
            </View>
          </Pressable>
        </View>
        <ScrollView style={styles.listContainer} contentContainerStyle={{ paddingBottom: 20 }}>
          <View style={styles.listContent}>
            <View>
              <AntDesign name="caret-up" size={24} color="#2f953b" />
            </View>
            <View>
              <Text style={styles.listTitle}>₱25,000.00</Text>
              <Text>BPI Salary</Text>
              <Text>02/17/2026</Text>
            </View>
          </View>
          <View style={styles.listContent}>
            <View>
              <AntDesign name="caret-down" size={24} color="#e91e1e" />
            </View>
            <View>
              <Text style={styles.listTitle}>₱15,000.00</Text>
              <Text>Refrigerator Installment</Text>
              <Text>02/17/2026</Text>
            </View>
          </View>
          <View style={styles.listContent}>
            <View>
              <AntDesign name="caret-down" size={24} color="#e91e1e" />
            </View>
            <View>
              <Text style={styles.listTitle}>₱9,500.00</Text>
              <Text>Washing Machine Installment</Text>
              <Text>02/10/2026</Text>
            </View>
          </View>
          <View style={styles.listContent}>
            <View>
              <AntDesign name="caret-up" size={24} color="#2f953b" />
            </View>
            <View>
              <Text style={styles.listTitle}>₱25,000.00</Text>
              <Text>Metrobank Salary</Text>
              <Text>02/17/2026</Text>
            </View>
          </View>
          <View style={styles.listContent}>
            <View>
              <AntDesign name="caret-down" size={24} color="#e91e1e" />
            </View>
            <View>
              <Text style={styles.listTitle}>₱15,000.00</Text>
              <Text>Refrigerator Installment</Text>
              <Text>02/17/2026</Text>
            </View>
          </View>
          <View style={styles.listContent}>
            <View>
              <AntDesign name="caret-down" size={24} color="#e91e1e" />
            </View>
            <View>
              <Text style={styles.listTitle}>₱9,500.00</Text>
              <Text>Washing Machine Installment</Text>
              <Text>02/10/2026</Text>
            </View>
          </View>
          <View style={styles.listContent}>
            <View>
              <AntDesign name="caret-up" size={24} color="#2f953b" />
            </View>
            <View>
              <Text style={styles.listTitle}>₱25,000.00</Text>
              <Text>Metrobank Salary</Text>
              <Text>02/17/2026</Text>
            </View>
          </View>
          <View style={styles.listContent}>
            <View>
              <AntDesign name="caret-down" size={24} color="#e91e1e" />
            </View>
            <View>
              <Text style={styles.listTitle}>₱15,000.00</Text>
              <Text>Refrigerator Installment</Text>
              <Text>02/17/2026</Text>
            </View>
          </View>
          <View style={styles.listContent}>
            <View>
              <AntDesign name="caret-down" size={24} color="#e91e1e" />
            </View>
            <View>
              <Text style={styles.listTitle}>₱9,500.00</Text>
              <Text>Washing Machine Installment</Text>
              <Text>02/10/2026</Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </>
  );
}

const { height: screenHeight } = Dimensions.get("window");

const styles = StyleSheet.create({
  listTitle: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  listContent: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "white",
    display: "flex",
    flexDirection: "row",
    gap: 20,
    alignItems: "center",
    marginBottom: 10,
    borderRadius: 5
  },
  listContainer: {
    backgroundColor: "#03620f",
    paddingVertical: 17,
    paddingHorizontal: 20,
    flex: 1,
    width: "100%",
    maxHeight: screenHeight * 0.65,
  },
  button: {
    backgroundColor: "#f1f1f1",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: "center",
    borderStyle: "solid",
    borderWidth: 1,
    width: 150,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },
  buttonText: {
    color: "#171717",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 5,
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  titleContainer: {
    backgroundColor: "#f1f1f1",
    paddingBlock: 30,
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  title: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#505050"
  },
  subTitle: {
    fontSize: 24,
    fontWeight: "bold"
  }
})
