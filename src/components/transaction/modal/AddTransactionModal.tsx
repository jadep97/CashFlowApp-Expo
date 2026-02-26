import { numberFormat } from "@/src/helpers/numberingFormat";
import { supabase } from "@/supabase";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import {
  ActivityIndicator,
  Button,
  Dialog,
  Portal,
  Text,
  TextInput,
} from "react-native-paper";
import Toast from "react-native-toast-message";

type AddTransactionModalProps = {
  open?: any;
  onOpenModal?: (open: any) => any;
  type?: any;
  transaction: any;
};

const AddTransactionModal = (props: AddTransactionModalProps) => {
  const { open, onOpenModal, type, transaction } = props;

  const queryClient = useQueryClient();

  const [amount, setAmount] = useState<any>(0);
  const [description, setDescription] = useState<any>("");
  const [loadingSubmit, setLoadingSubmit] = useState<any>(false);

  const addTransaction = async () => {
    if (!amount || parseFloat(amount.replace(/,/g, "")) <= 0) return;

    try {
      setLoadingSubmit(true);

      const payload = {
        amount: Number(amount.replace(/,/g, "")),
        transaction_description: description,
      };

      let error = null;

      if (transaction) {
        ({ error } = await supabase
          .from("transactions")
          .update(payload)
          .eq("transaction_id", transaction.transaction_id));
      } else {
        ({ error } = await supabase
          .from("transactions")
          .insert({
            ...payload,
            transaction_type_id: type,
            user_id: 1,
          }));
      }

      if (error) throw error;

      setAmount("");
      setDescription("");

      queryClient.invalidateQueries({
        queryKey: ["transactions"],
      });

      queryClient.invalidateQueries({
        queryKey: ["transactionTotals"],
      });
      Toast.show({
        type: "success",
        text1: "Success",
        text2: transaction ? "Changes applied" : "Transaction saved",
      });
      onOpenModal?.(false);

    } catch (err: any) {
      console.log("❌ Error:", err.message);
    } finally {
      setLoadingSubmit(false);
    }
  };

  const handleAmountChange = (text: string) => {
    const cleanText = text.replace(/[^0-9.]/g, "");
    const [whole, decimal] = cleanText.split(".");
    const formattedWhole = Number(whole || 0).toLocaleString();
    setAmount(
      decimal !== undefined ? `${formattedWhole}.${decimal}` : formattedWhole,
    );
  };

  useEffect(() => {
    if (transaction) {
      setAmount(numberFormat(transaction?.amount));
      setDescription(transaction?.transaction_description);
    } else {
      setAmount(0);
      setDescription("");
    }
  }, [transaction])

  return (
    <>
      <Portal>
        {loadingSubmit && (
          <View style={styles.fullScreenOverlay}>
            <ActivityIndicator animating={true} color="blue" size={60} />
            <Text style={styles.loadingText}>Saving...</Text>
          </View>
        )}
        <Dialog
          visible={open}
          onDismiss={() => onOpenModal && onOpenModal(false)}
          style={{ backgroundColor: "white" }}
        >
          <Dialog.Content style={styles.modalContent}>
            <Text style={[styles.modalTitle, { fontSize: 22 }]}>{type === 1 ? "Cash In" : "Cash Out"}</Text>

            <TextInput
              mode="outlined"
              label="Amount"
              placeholder="Enter an amount"
              keyboardType="decimal-pad"
              value={amount}
              onChangeText={handleAmountChange}
            />

            <TextInput
              mode="outlined"
              label="Note"
              placeholder="Enter transaction description"
              value={description}
              onChangeText={setDescription}
            />
          </Dialog.Content>

          <Dialog.Actions>
            <Button onPress={() => onOpenModal && onOpenModal(false)}>
              Cancel
            </Button>
            <Button onPress={addTransaction}>Ok</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
};

export default AddTransactionModal;

const styles = StyleSheet.create({
  modalContent: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
    borderRadius: 12,
  },
  loadingText: {
    color: "#fff",
    marginTop: 10,
    fontSize: 16,
    fontWeight: "bold",
  },
  fullScreenOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
});
