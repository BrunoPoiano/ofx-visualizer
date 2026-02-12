import {
	isNumberOrDefault,
	isObject,
	isStringOrDefault
} from '@/lib/typeValidation'
import type { balanceType, GenericObject, StatementType } from '../../types'

export function parseStatement(data: unknown): StatementType[] {
	if (!Array.isArray(data)) return []

	return data.reduce<StatementType[]>((prev, item) => {
		if (!isObject(item) || !isObject(item.statement)) {
			return prev
		}

		const id = isNumberOrDefault(item.statement.id)
		const source_id = isNumberOrDefault(item.statement.source_id)

		if (!id || !source_id) {
			return prev
		}

		const statement: StatementType = {
			id,
			source_id,
			start_date: isStringOrDefault(item.statement.start_date),
			end_date: isStringOrDefault(item.statement.end_date),
			ledger_balance: isNumberOrDefault(item.statement.ledger_balance, 0),
			balance_date: isStringOrDefault(item.statement.balance_date),
			server_date: isStringOrDefault(item.statement.server_date),
			language: isStringOrDefault(item.statement.language),
			yields: []
		}

		prev.push({
			...statement,
			yields: Array.isArray(item.yields) ? parseBalance(item.yields) : []
		})

		return prev
	}, [])
}

export function parseStatementObj(statement: GenericObject) {
	const obj: StatementType = {
		id: isNumberOrDefault(statement.id, 0),
		source_id: isNumberOrDefault(statement.source_id, 0),
		start_date: isStringOrDefault(statement.start_date),
		end_date: isStringOrDefault(statement.end_date),
		ledger_balance: isNumberOrDefault(statement.ledger_balance, 0),
		balance_date: isStringOrDefault(statement.balance_date),
		server_date: isStringOrDefault(statement.server_date),
		language: isStringOrDefault(statement.language),
		yields: []
	}

	return obj
}

function parseBalance(data: unknown): balanceType[] {
	if (!Array.isArray(data)) return []

	return data.reduce<balanceType[]>((prev, item) => {
		if (!isObject(item)) {
			return prev
		}

		const id = isNumberOrDefault(item.id)
		const statement_id = isNumberOrDefault(item.statement_id)

		if (!id || !statement_id) {
			return prev
		}

		const newItem: balanceType = {
			id,
			statement_id,
			name: isStringOrDefault(item.name),
			desc: isStringOrDefault(item.desc),
			bal_type: isStringOrDefault(item.bal_type),
			value: isNumberOrDefault(item.value, 0)
		}

		prev.push(newItem)
		return prev
	}, [])
}
