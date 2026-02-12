import {
	isNumberOrDefault,
	isObject,
	isStringOrDefault,
	notEmptyString
} from '@/lib/typeValidation'
import { TransactionTypeValues, type TransactionType } from '../../types'
import { ensureOneOf } from '@/lib/utils'

export function parseTransaction(data: unknown): TransactionType[] {
	if (!isObject(data) || !Array.isArray(data.data)) {
		return []
	}

	return data.data.reduce<TransactionType[]>((prev, item) => {
		if (!isObject(item)) {
			return prev
		}
		const source_id = isNumberOrDefault(item.source_id)
		if (!source_id) {
			return prev
		}

		const newItem: TransactionType = {
			source_id,
			id: isStringOrDefault(item.id),
			date: isStringOrDefault(item.date),
			type: ensureOneOf(item.type, TransactionTypeValues, 'OTHER'),
			value: isNumberOrDefault(item.value, 0),
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
		positive: isNumberOrDefault(data.positive, 0),
		negative: isNumberOrDefault(data.negative, 0),
		value: isNumberOrDefault(data.value, 0)
	}
}
