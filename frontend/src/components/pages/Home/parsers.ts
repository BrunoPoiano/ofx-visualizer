import moment from "moment";
import type { DateRange } from "react-day-picker";
import { isNumberOrDefault, isStringOrDefault } from "@/lib/typeValidation";
import type {
  balanceType,
  BankType,
  StatementType,
  TransactionInfoType,
  TransactionType,
} from "./types";

export const parseBanks = (data: unknown): BankType[] => {
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

export const parseTransaction = (data: unknown): TransactionType[] => {
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
      type: isStringOrDefault(typedItem.type) as TransactionType["type"],
      value: isNumberOrDefault(typedItem.value),
      desc: isStringOrDefault(typedItem.desc),
    };

    prev.push(newItem);
    return prev;
  }, []);
};

export const parseTransactionInfo = (data: unknown): TransactionInfoType => {
  if (typeof data !== "object" || data === null) {
    return {
      positive: 0,
      negative: 0,
      value: 0,
    };
  }

  const typedItem = data as Record<string, unknown>;

  return {
    positive: isNumberOrDefault(typedItem.positive),
    negative: isNumberOrDefault(typedItem.negative),
    value: isNumberOrDefault(typedItem.value),
  };
};

export const parseFilterDate = (
  date: DateRange | undefined,
): { from: string; to: string | undefined } | undefined => {
  if (!date) return;
  const from = moment(date.from).format("yyyy-MM-DD");
  const to = date.to ? moment(date.to).format("yyyy-MM-DD") : undefined;
  return { from, to };
};

export const parseStatementObj = (
  item: Record<string, unknown>,
): StatementType => {
  let yields: balanceType[] = [];

  if (item.yields) {
    yields = parseBalance(item.yields as unknown[]);
  }

  return {
    id: isNumberOrDefault(item.id),
    bank_id: isNumberOrDefault(item.bank_id),
    start_date: isStringOrDefault(item.start_date),
    end_date: isStringOrDefault(item.end_date),
    ledger_balance: isNumberOrDefault(item.ledger_balance),
    balance_date: isStringOrDefault(item.balance_date),
    server_date: isStringOrDefault(item.server_date),
    language: isStringOrDefault(item.language),
    yields: yields,
  };
};

export const parseStatement = (data: unknown[]): StatementType[] => {
  if (!Array(data)) return [];

  return data.reduce<StatementType[]>((prev, item) => {
    if (typeof item !== "object" || item === null) {
      return prev;
    }

    const typedItem = item as Record<string, unknown>;
    prev.push(parseStatementObj(typedItem));
    return prev;
  }, []);
};

export const parseBalance = (data: unknown[]): balanceType[] => {
  if (!data || data === null || !Array(data)) return [];

  return data.reduce<balanceType[]>((prev, item) => {
    if (typeof item !== "object" || item === null) {
      return prev;
    }

    const typedItem = item as Record<string, unknown>;

    const newItem: balanceType = {
      id: isNumberOrDefault(typedItem.id),
      statement_id: isNumberOrDefault(typedItem.statement_id),
      name: isStringOrDefault(typedItem.name),
      desc: isStringOrDefault(typedItem.desc),
      bal_type: isStringOrDefault(typedItem.bal_type),
      value: isNumberOrDefault(typedItem.value),
    };

    prev.push(newItem);
    return prev;
  }, []);
};
