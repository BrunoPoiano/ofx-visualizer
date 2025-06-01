import { axiosInstance } from "@/lib/axiosInstance";
import type {
  BankType,
  StatementType,
  TransactionInfoType,
  TransactionType,
} from "./types";
import type { PaginationType } from "@/types";
import { parsePagination } from "@/lib/typeValidation";
import {
  parseBanks,
  parseStatement,
  parseTransaction,
  parseTransactionInfo,
} from "./parsers";

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

export const getTransactionsInfo = async (
  params?: Record<string, string>,
): Promise<TransactionInfoType> => {
  const { data } = await axiosInstance.get("/transactions_info", {
    params: params,
  });

  return parseTransactionInfo(data);
};

export const getStatesments = async (
  params?: Record<string, string>,
): Promise<{ data: StatementType[]; paginationContent: PaginationType }> => {
  const { data } = await axiosInstance.get("/statements", {
    params: params,
  });

  return {
    data: parseStatement(data.data),
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

export const postOfxFile = async (formData: FormData): Promise<void> => {
  await axiosInstance.post("/transactions", formData);
};
