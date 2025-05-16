import { axiosInstance } from "@/lib/axiosInstance";
import type { TransactionType } from "./types";
import type { PaginationType } from "@/types";
import {
  isNumberOrDefault,
  isStringOrDefault,
  parsePagination,
} from "@/lib/typeValidation";

export const getTransactions = async (
  params?: { string: string }[],
): Promise<{ data: TransactionType[]; pagination: PaginationType }> => {
  const { data } = await axiosInstance.get("/transactions", {
    params: { params },
  });

  return { data: parseTransaction(data), pagination: parsePagination(data) };
};

const parseTransaction = (data: unknown): TransactionType[] => {
  if (typeof data !== "object" || data === null) return [];

  if (!("data" in (data as Record<string, unknown>))) return [];

  const transactionData = (data as Record<string, unknown[]>).data;
  if (!Array.isArray(transactionData)) return [];

  return transactionData.reduce<TransactionType[]>((prev, item) => {
    if (typeof item !== "object" || item === null) {
      return prev;
    }

    const typedItem = item as Record<string, unknown>;

    const newItem: TransactionType = {
      id: isStringOrDefault(typedItem.id),
      bank_id: isNumberOrDefault(typedItem.bank_id),
      date: new Date(typedItem.date as string),
      type: isStringOrDefault(typedItem.type),
      value: isNumberOrDefault(typedItem.value),
      desc: isStringOrDefault(typedItem.desc),
    };

    prev.push(newItem);
    return prev;
  }, []);
};
