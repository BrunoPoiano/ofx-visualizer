import { axiosInstance } from "@/lib/axiosInstance";
import type { BankType, TransactionType } from "./types";
import type { PaginationType } from "@/types";
import {
  isNumberOrDefault,
  isStringOrDefault,
  parsePagination,
} from "@/lib/typeValidation";
import type { DateRange } from "react-day-picker";
import moment from "moment";

export const getTransactions = async (
  params?: Record<string, string>,
): Promise<{ data: TransactionType[]; paginationContent: PaginationType }> => {
  const { data } = await axiosInstance.get("/transactions", {
    params: params,
  });

  return {
    data: parseTransaction(data),
    paginationContent: parsePagination(data),
  };
};

export const getBanks = async (
  params?: Record<string, string>,
): Promise<{ data: BankType[]; paginationContent: PaginationType }> => {
  const { data } = await axiosInstance.get("/banks", {
    params: params,
  });

  return {
    data: parseBanks(data),
    paginationContent: parsePagination(data),
  };
};

const parseBanks = (data: unknown): BankType[] => {
  if (typeof data !== "object" || data === null) return [];

  if (!("data" in (data as Record<string, unknown>))) return [];

  const bankData = (data as Record<string, unknown[]>).data;
  if (!Array.isArray(bankData)) return [];

  return bankData.reduce<BankType[]>((prev, item) => {
    if (typeof item !== "object" || item === null) {
      return prev;
    }

    const typedItem = item as Record<string, unknown>;

    const newItem: BankType = {
      id: isNumberOrDefault(typedItem.id),
      name: isStringOrDefault(typedItem.name),
      account_id: isStringOrDefault(typedItem.account_id),
    };

    prev.push(newItem);
    return prev;
  }, []);
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
      date: isStringOrDefault(typedItem.date),
      type: isStringOrDefault(typedItem.type),
      value: isNumberOrDefault(typedItem.value),
      desc: isStringOrDefault(typedItem.desc),
    };

    prev.push(newItem);
    return prev;
  }, []);
};

export const parseFilterDate = (
  date: DateRange | undefined,
): { from: string; to: string | undefined } | undefined => {
  if (!date) return;
  const from = moment(date.from).format("yyyy-MM-DD");
  const to = date.to ? moment(date.to).format("yyyy-MM-DD") : undefined;
  return { from, to };
};

export const postOfxFile = async (formData: FormData): Promise<void> => {
  await axiosInstance.post("/transactions", formData);
};
