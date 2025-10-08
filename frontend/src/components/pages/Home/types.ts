import type { JSX } from 'react'
import type { DateRange } from 'react-day-picker'
import type { PaginationType } from '@/types'

export const TransactionTypeValues = [
	'CREDIT',
	'DEBIT',
	'INT',
	'DIV',
	'FEE',
	'SRVCHG',
	'DEP',
	'ATM',
	'POS',
	'XFER',
	'CHECK',
	'PAYMENT',
	'CASH',
	'DIRECTDEP',
	'DIRECTDEBIT',
	'REPEATPMT',
	'OTHER'
] as const

type Tabs = 'transaction' | 'statement' | 'banks'

export const AccountTypeValues = [
	'CHECKING',
	'SAVINGS',
	'MONEYMRKT',
	'CREDITLINE',
	'CMA'
] as const

export type DefaultFilterType = {
	date: DateRange | undefined
	source_id: string
}

export type OrderBy = {
	direction: 'DESC' | 'ASC'
	order:
		| keyof balanceType
		| keyof StatementType
		| keyof TransactionType
		| keyof BankType
}

export type TableInfoType<T extends OrderBy['order']> = {
	id: T | 'options'
	label: string
	class?: string
	style?: React.CSSProperties
	showValue?: true
}

export type TransactionType = {
	id: string
	source_id: number
	date: string
	type: (typeof TransactionTypeValues)[number]
	value: number
	desc: string
}

export type BankType = {
	id: number
	name: string
	account_id: string
	account_type: (typeof AccountTypeValues)[number]
	bank_id: number
	branch_id: number
	f_id: number
}

export type TransactionInfoType = {
	positive: number
	negative: number
	value: number
}

export type StatementType = {
	id: number
	source_id: number
	start_date: string
	end_date: string
	ledger_balance: number
	balance_date: string
	server_date: string
	language: string
	yields: balanceType[]
}

export type balanceType = {
	id: number
	statement_id: number
	name: string
	desc: string
	bal_type: string
	value: number
}

export type HomeTabs = {
	tab: Tabs
	content: JSX.Element
}

export type SourceType = {
	id: number
	name: string
}

export type GetBanksFuncParams = {
	per_page?: PaginationType['per_page']
	current_page?: PaginationType['current_page']
	order?: OrderBy['order']
	direction?: OrderBy['direction']
	search?: string
}
