import moment from 'moment'
import type { DateRange } from 'react-day-picker'
import {
	isNumberOrDefault,
	isObject,
	isStringOrDefault,
	notEmptyString
} from '@/lib/typeValidation'
import { ensureOneOf } from '@/lib/utils'
import {
	AccountTypeValues,
	type BankType,
	type balanceType,
	type StatementType,
	type TransactionType,
	TransactionTypeValues,
	type GenericObject
} from './types'

export function parseBanks(data: unknown): BankType[] {
	if (!isObject(data) || !('data' in data) || !Array.isArray(data.data)) {
		return []
	}

	return data.data.reduce<BankType[]>((prev, item) => {
		if (typeof item !== 'object' || item === null) {
			return prev
		}

		const typedItem = item as GenericObject

		const newItem: BankType = {
			id: isNumberOrDefault(typedItem.id),
			name: isStringOrDefault(typedItem.name),
			account_id: isStringOrDefault(typedItem.account_id),
			account_type: ensureOneOf(
				typedItem.account_type,
				AccountTypeValues,
				'CHECKING'
			),
			bank_id: isNumberOrDefault(typedItem.bank_id),
			branch_id: isNumberOrDefault(typedItem.branch_id),
			f_id: isNumberOrDefault(typedItem.f_id)
		}

		prev.push(newItem)
		return prev
	}, [])
}

export function parseTransaction(data: unknown): TransactionType[] {
	if (!isObject(data) || !('data' in data) || !Array.isArray(data.data)) {
		return []
	}

	return data.data.reduce<TransactionType[]>((prev, item) => {
		if (!isObject(item)) {
			return prev
		}

		const newItem: TransactionType = {
			id: isStringOrDefault(item.id),
			source_id: isNumberOrDefault(item.source_id),
			date: isStringOrDefault(item.date),
			type: ensureOneOf(item.type, TransactionTypeValues, 'OTHER'),
			value: isNumberOrDefault(item.value),
			desc: isStringOrDefault(item.desc),
			tags: notEmptyString(item.tags) ? item.tags.split(',') : []
		}

		prev.push(newItem)
		return prev
	}, [])
}

export function parseTransactionInfo(data: unknown): {
	positive: number
	negative: number
	value: number
} {
	if (!isObject(data)) {
		return {
			positive: 0,
			negative: 0,
			value: 0
		}
	}

	return {
		positive: isNumberOrDefault(data.positive),
		negative: isNumberOrDefault(data.negative),
		value: isNumberOrDefault(data.value)
	}
}

export function parseFilterDate(date: DateRange | undefined):
	| {
			from: string
			to: string | undefined
	  }
	| undefined {
	if (!date) return
	const from = moment(date.from).format('yyyy-MM-DD')
	const to = date.to ? moment(date.to).format('yyyy-MM-DD') : undefined
	return { from, to }
}

export function parseStatementObj(item: GenericObject) {
	return {
		id: isNumberOrDefault(item.id),
		source_id: isNumberOrDefault(item.source_id),
		start_date: isStringOrDefault(item.start_date),
		end_date: isStringOrDefault(item.end_date),
		ledger_balance: isNumberOrDefault(item.ledger_balance),
		balance_date: isStringOrDefault(item.balance_date),
		server_date: isStringOrDefault(item.server_date),
		language: isStringOrDefault(item.language),
		yields: []
	}
}

export function parseStatement(data: unknown): StatementType[] {
	if (!Array.isArray(data)) return []

	return data.reduce<StatementType[]>((prev, item) => {
		if (!isObject(item) || !isObject(item.statement)) {
			return prev
		}

		prev.push({
			...parseStatementObj(item.statement),
			yields: Array.isArray(item.yields) ? parseBalance(item.yields) : []
		})

		return prev
	}, [])
}

export function parseBalance(data: unknown): balanceType[] {
	if (!Array.isArray(data)) return []

	return data.reduce<balanceType[]>((prev, item) => {
		if (typeof item !== 'object' || item === null) {
			return prev
		}

		const typedItem = item as GenericObject

		const newItem: balanceType = {
			id: isNumberOrDefault(typedItem.id),
			statement_id: isNumberOrDefault(typedItem.statement_id),
			name: isStringOrDefault(typedItem.name),
			desc: isStringOrDefault(typedItem.desc),
			bal_type: isStringOrDefault(typedItem.bal_type),
			value: isNumberOrDefault(typedItem.value)
		}

		prev.push(newItem)
		return prev
	}, [])
}
