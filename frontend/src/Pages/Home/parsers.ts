import moment from "moment";
import type { DateRange } from "react-day-picker";
import type { BankType, TransactionInfoType, TransactionType } from "./types";
import { isNumberOrDefault, isStringOrDefault } from "@/lib/typeValidation";

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
			type: isStringOrDefault(typedItem.type),
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
