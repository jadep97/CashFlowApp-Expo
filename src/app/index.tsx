import { supabase } from "@/supabase";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import {
  Dimensions,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { ActivityIndicator } from "react-native-paper";
import AddTransactionModal from "../components/transaction/modal/AddTransactionModal";
import { pageSize } from "../constants";
import { formatDate } from "../helpers/dateFormat";
import { numberFormat } from "../helpers/numberingFormat";

export default function Index() {
  const [user, setUser] = useState<any>(null);
  const [openTransactionModal, setOpenTransactionModal] = useState<any>(false);
  const [transactionType, setTransactionType] = useState<any>([]);

  const [totalIncome, setTotalIncome] = useState<any>(0);

  const loadTransactions = async ({ pageParam = 0 }) => {
    const from = pageParam * pageSize;
    const to = from + pageSize - 1;

    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .eq("user_id", 1)
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) throw error;

    return data || [];
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["transactions"] as const,
    queryFn: loadTransactions,
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage || lastPage.length < pageSize) {
        return undefined;
      }
      return allPages.length;
    },
  });

  const transactions = useMemo(() => {
    return data ? data.pages.flat() : [];
  }, [data]);

  useEffect(() => {
    getUser();

    if (transactions) {
      const income = transactions.reduce(
        (sum, txn) =>
          txn?.transaction_type_id === 1 ? sum + Number(txn.amount) : sum,
        0,
      );

      const expenses = transactions.reduce(
        (sum, txn) =>
          txn?.transaction_type_id === 2 ? sum + Number(txn.amount) : sum,
        0,
      );

      setTotalIncome(
        ((income - expenses) * 100 / 100)
          .toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      );

    }
  }, [transactions]);

  const getUser = async () => {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("user_id", 1);

    if (error) {
      console.log("❌ Error:", error.message);
    } else {
      setUser(data);
    }
  };

  const renderTransaction = ({ item }: { item: any }) => (
    <View style={styles.listContent}>
      <View>
        <AntDesign
          name={item.transaction_type_id === 1 ? "caret-up" : "caret-down"}
          size={24}
          color={item.transaction_type_id === 1 ? "#2f953b" : "#e91e1e"}
        />
      </View>
      <View>
        <Text style={styles.listTitle}>₱{(numberFormat(item.amount))}</Text>
        <Text>{item.transaction_description}</Text>
        <Text>{formatDate(item.created_at)}</Text>
      </View>
    </View>
  );

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
          <Text style={styles.title}>
            {user && user[0]?.lastname}&apos;s Total Income
          </Text>
          <Text style={styles.subTitle}>₱{numberFormat(totalIncome)}</Text>
        </View>
        <View style={styles.buttonContainer}>
          <Pressable
            style={({ pressed }) => [
              styles.button,
              { opacity: pressed ? 0.6 : 1 },
            ]}
            onPress={() => {
              setOpenTransactionModal(true);
              setTransactionType(1);
            }}
          >
            <View style={styles.buttonContent}>
              <MaterialCommunityIcons
                name="cash-plus"
                size={24}
                color="#014eba"
              />
              <Text style={styles.buttonText}>Cash In</Text>
            </View>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.button,
              { opacity: pressed ? 0.6 : 1 },
            ]}
            onPress={() => {
              setOpenTransactionModal(true);
              setTransactionType(2);
            }}
          >
            <View style={styles.buttonContent}>
              <MaterialCommunityIcons
                name="cash-minus"
                size={24}
                color="#d62d2d"
              />
              <Text style={styles.buttonText}>Cash Out</Text>
            </View>
          </Pressable>
        </View>
        <View style={styles.listContainer}>
          <FlatList
            data={transactions}
            keyExtractor={(item) => item.transaction_id.toString()}
            renderItem={renderTransaction}
            onEndReached={() => {
              if (hasNextPage) fetchNextPage();
            }}
            onEndReachedThreshold={0.5}
            ListFooterComponent={
              isLoading || isFetchingNextPage ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : null
            }
          />
        </View>
      </View>
    </>
  );
}

const { height: screenHeight } = Dimensions.get("window");

const styles = StyleSheet.create({
  listTitle: {
    fontSize: 18,
    fontWeight: "bold",
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
    borderRadius: 5,
  },
  listContainer: {
    backgroundColor: "#254429",
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
    justifyContent: "center",
  },
  title: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#505050",
  },
  subTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
});
