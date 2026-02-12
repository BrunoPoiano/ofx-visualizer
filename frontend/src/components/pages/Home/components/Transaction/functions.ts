import { axiosInstance } from '@/lib/axiosInstance'
import type { Params } from '../../types'
import { parseTransaction, parseTransactionInfo } from './parsers'
import { parsePagination } from '@/lib/typeValidation'

export async function getTransactions(params?: Params) {
	const { data } = await axiosInstance.get('/transactions', {
		params: params
	})

	return {
		data: parseTransaction(data),
		paginationContent: parsePagination(data)
	}
}

export async function getTransactionsInfo(params?: Params) {
	const { data } = await axiosInstance.get('/transactions/info', {
		params: params
	})

	return parseTransactionInfo(data)
}
