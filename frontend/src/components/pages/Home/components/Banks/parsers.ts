import {
	isNumberOrDefault,
	isObject,
	isStringOrDefault
} from '@/lib/typeValidation'
import { AccountTypeValues, type BankType } from '../../types'
import { ensureOneOf } from '@/lib/utils'

export function parseBanks(data: unknown): BankType[] {
	if (!isObject(data) || !Array.isArray(data.data)) {
		return []
	}

	return data.data.reduce<BankType[]>((prev, item) => {
		if (!isObject(item)) {
			return prev
		}

		const id = isNumberOrDefault(item.id)
		const bank_id = isNumberOrDefault(item.bank_id)
		const branch_id = isNumberOrDefault(item.branch_id)
		const f_id = isNumberOrDefault(item.f_id)

		if (!id || !bank_id || !branch_id || !f_id) {
			return prev
		}

		const newItem: BankType = {
			id,
			bank_id,
			branch_id,
			f_id,
			name: isStringOrDefault(item.name),
			account_id: isStringOrDefault(item.account_id),
			account_type: ensureOneOf(
				item.account_type,
				AccountTypeValues,
				'CHECKING'
			)
		}

		prev.push(newItem)
		return prev
	}, [])
}
