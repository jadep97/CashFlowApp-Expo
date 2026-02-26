import { supabase } from "@/supabase";
import AntDesign from "@expo/vector-icons/AntDesign";
import Fontisto from "@expo/vector-icons/Fontisto";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useInfiniteQuery, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import {
  Dimensions,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { ActivityIndicator, SegmentedButtons } from "react-native-paper";
import Toast from "react-native-toast-message";
import AddTransactionModal from "../components/transaction/modal/AddTransactionModal";
import { pageSize } from "../constants";
import { formatDate } from "../helpers/dateFormat";
import { numberFormat } from "../helpers/numberingFormat";

export default function Index() {
  const queryClient = useQueryClient();

  const [user, setUser] = useState<any>(null);
  const [openTransactionModal, setOpenTransactionModal] = useState<any>(false);
  const [transactionType, setTransactionType] = useState<any>([]);
  const [filterType, setFilterType] = useState<any>('all');

  const [showBalance, setShowBalance] = useState<any>(true);

  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);

  const loadTransactions = async ({ pageParam = 0 }) => {
    const from = pageParam * pageSize;
    const to = from + pageSize - 1;

    let query = supabase
      .from("transactions")
      .select("*")
      .eq("user_id", 1)
      .order("created_at", { ascending: false })
      .range(from, to);

    if (filterType === "income") {
      query = query.eq("transaction_type_id", 1);
    } else if (filterType === "expense") {
      query = query.eq("transaction_type_id", 2);
    }

    const { data, error } = await query;

    if (error) throw error;

    return data || [];
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ["transactions", filterType],
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

  const loadTotals = async () => {
    const { data, error } = await supabase
      .from("transactions")
      .select("transaction_type_id, amount")
      .eq("user_id", 1);

    if (error) throw error;

    return data || [];
  };

  const { data: totalsData } = useQuery({
    queryKey: ["transactionTotals"],
    queryFn: loadTotals,
  });

  const { income, expenses, balance } = useMemo(() => {
    if (!totalsData) {
      return { income: 0, expenses: 0, balance: "0.00" };
    }

    const income = totalsData.reduce(
      (sum, txn) =>
        txn.transaction_type_id === 1 ? sum + Number(txn.amount) : sum,
      0
    );

    const expenses = totalsData.reduce(
      (sum, txn) =>
        txn.transaction_type_id === 2 ? sum + Number(txn.amount) : sum,
      0
    );

    return {
      income,
      expenses,
      balance: (income - expenses).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
    };
  }, [totalsData]);

  useEffect(() => {
    getUser();
  }, []);

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

  const handleDelete = async (id: any) => {
    await supabase.from("transactions")
      .delete()
      .eq("transaction_id", id);

    queryClient.invalidateQueries({
      queryKey: ["transactions"],
    });

    queryClient.invalidateQueries({
      queryKey: ["transactionTotals"],
    });
    Toast.show({
      type: "success",
      text1: "Success",
      text2: "Successfully deleted",
    });
  };

  const renderRightActions = (item: any, onDelete: any) => (
    <View style={{ width: 80, marginBottom: 10, display: "flex", gap: 3, paddingLeft: 8 }}>
      <TouchableOpacity
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#f8882d',
          borderRadius: 5
        }}
        onPress={() => {
          setSelectedTransaction(item);
          setOpenTransactionModal(true);
        }}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Edit</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#ff3b30',
          borderRadius: 5
        }}
        onPress={onDelete}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  const renderTransaction = ({ item }: { item: any }) => (
    <Swipeable
      renderRightActions={() =>
        renderRightActions(
          item,
          () => handleDelete(item.transaction_id)
        )
      }
    >
      <View style={styles.listContent}>
        <View>
          <AntDesign
            name={item.transaction_type_id === 1 ? "caret-up" : "caret-down"}
            size={24}
            color={item.transaction_type_id === 1 ? "#2f953b" : "#e91e1e"}
          />
        </View>
        <View>
          <Text style={styles.listTitle}>₱{numberFormat(item.amount)}</Text>
          <Text>{item.transaction_description}</Text>
          <Text>{formatDate(item.created_at)}</Text>
        </View>
      </View>
    </Swipeable>
  );

  return (
    <>
      {openTransactionModal && (
        <AddTransactionModal
          open={openTransactionModal}
          onOpenModal={(open) => setOpenTransactionModal(open)}
          type={transactionType}
          transaction={selectedTransaction}
        />
      )}

      <View
        style={{
          flex: 1,
          display: "flex",
          rowGap: 10,
          width: "100%",
          backgroundColor: "#f4f4f4",
        }}
      >
        <View style={styles.titleContainer}>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <View style={{ display: "flex", gap: 3 }}>
              <Text style={{ fontSize: 16 }}>Welcome 👋</Text>
              <Text style={{ fontSize: 24, fontWeight: "bold" }}>
                {user && user[0]?.firstname + " " + user[0]?.lastname}
              </Text>
            </View>
            <Fontisto name="bell" size={22} color="#7a7a7a" />
          </View>
          <View>
            <Text style={{ fontSize: 16 }}>Your Balance</Text>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
              }}
            >
              <Text style={styles.subTitle}>
                ₱ {showBalance ? numberFormat(balance) : "******"}
              </Text>
              <Pressable
                onPress={() => {
                  setShowBalance((prev: any) => prev ? false : true)
                }}
              >
                {showBalance ? (
                  <MaterialCommunityIcons
                    name="eye-off-outline"
                    size={24}
                    color="#555555"
                  />
                ) : (
                  <MaterialCommunityIcons
                    name="eye-outline"
                    size={24}
                    color="#555555"
                  />
                )}
              </Pressable>
            </View>
          </View>
        </View>
        <View
          style={{
            padding: 18,
            width: "100%",
          }}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-evenly",
              backgroundColor: "white",
              position: "absolute",
              left: 22,
              top: -45,
              width: "100%",
              borderRadius: 5,
              padding: 15,
              elevation: 6,
            }}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
              }}
            >
              <View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 3,
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      width: 15,
                      height: 15,
                      backgroundColor: "#f44848",
                      borderRadius: 100,
                    }}
                  ></Text>
                  <Text style={{ fontSize: 17, color: "#787777ca" }}>
                    Expenses
                  </Text>
                </View>
                <Text
                  style={{ marginLeft: 5, fontWeight: "bold", fontSize: 24 }}
                >
                  ₱{numberFormat(expenses)}
                </Text>
              </View>
            </View>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
              }}
            >
              <View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 3,
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      width: 15,
                      height: 15,
                      backgroundColor: "#5bea84",
                      borderRadius: 100,
                    }}
                  ></Text>
                  <Text style={{ fontSize: 17, color: "#787777ca" }}>
                    Income
                  </Text>
                </View>
                <Text
                  style={{ marginLeft: 5, fontWeight: "bold", fontSize: 24 }}
                >
                  ₱{numberFormat(income)}
                </Text>
              </View>
            </View>
          </View>
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
              <View style={{ backgroundColor: "#afee68", padding: 8, borderRadius: 10 }}>
                <MaterialCommunityIcons name="cash-plus" size={30} color="#1f470e" />
              </View>
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
              <View style={{ backgroundColor: "#afee68", padding: 8, borderRadius: 10 }}>
                <MaterialCommunityIcons name="cash-minus" size={30} color="#1f470e" />
              </View>
              <Text style={styles.buttonText}>Cash Out</Text>
            </View>
          </Pressable>
        </View>
        <View style={{
          alignItems: 'center',
          paddingInline: 25
        }}>
          <SegmentedButtons
            value={filterType}
            onValueChange={(e) => {
              setFilterType(e);
            }}
            theme={{
              colors: {
                secondaryContainer: '#b1b1b1',
                onSecondaryContainer: '#FFFFFF',
              },
            }}
            buttons={[
              {
                value: 'all',
                label: 'All',
              },
              {
                value: 'income',
                label: 'Income',
              },
              { value: 'expense', label: 'Expenses' },
            ]}
            style={{ borderRadius: 5, overflow: 'hidden' }}
          />
        </View>
        <View style={styles.listContainer}>
          <FlatList
            style={{ paddingInline: 5, paddingBlock: 5 }}
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
    elevation: 2,
    borderStyle: "solid",
    borderColor: "black",
  },
  listContainer: {
    backgroundColor: "#f4f4f4",
    paddingHorizontal: 20,
    flex: 1,
    width: "100%",
    maxHeight: screenHeight * 0.40,
    borderTopEndRadius: 15,
    borderTopLeftRadius: 15,
  },
  button: {
    alignItems: "center",
  },
  buttonContent: {
    alignItems: "center",
    justifyContent: "space-evenly",
    gap: 3,
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
    backgroundColor: "#cbf0d465",
    paddingBlock: 15,
    width: "100%",
    display: "flex",
    paddingInline: 20,
    gap: 15,
    height: 190,
    maxHeight: 220,
    borderRadius: 20,
  },
  title: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#505050",
  },
  subTitle: {
    fontSize: 30,
    fontWeight: "bold",
  },
});
