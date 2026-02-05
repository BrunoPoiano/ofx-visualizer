import { axiosInstance } from '@/lib/axiosInstance'
import {
	isNumberOrDefault,
	isStringOrDefault,
	parsePagination
} from '@/lib/typeValidation'
import {
	parseBanks,
	parseStatement,
	parseStatementObj,
	parseTransaction,
	parseTransactionInfo
} from './parsers'
import type { BankType, SourceType } from './types'

export async function getTransactions(params?: Record<string, string>) {
	const { data } = await axiosInstance.get('/transactions', {
		params: params
	})

	return {
		data: parseTransaction(data),
		paginationContent: parsePagination(data)
	}
}

export async function getTransactionsInfo(params?: Record<string, string>) {
	const { data } = await axiosInstance.get('/transactions/info', {
		params: params
	})

	return parseTransactionInfo(data)
}

export async function getStatesments(params?: Record<string, string>) {
	const { data } = await axiosInstance.get('/statements', {
		params: params
	})

	return {
		data: parseStatement(data.data),
		paginationContent: parsePagination(data)
	}
}

export async function getStatesmentsInfo(
	bankId: string,
	params?: Record<string, string>
) {
	const { data } = await axiosInstance.get(`/statements/${bankId}/info`, {
		params: params
	})

	if (!data.currentBalance || !data.currentBalance) {
		throw new Error('No content')
	}

	return {
		currentBalance: parseStatementObj(data.currentBalance),
		largestBalance: parseStatementObj(data.largestBalance)
	}
}

export async function getBanks(params?: Record<string, string>) {
	const { data } = await axiosInstance.get('/banks', {
		params: params
	})

	return {
		data: parseBanks(data),
		paginationContent: parsePagination(data)
	}
}

export async function getSources() {
	const { data } = await axiosInstance.get('/source')

	if (!Array.isArray(data)) return []

	const sources = data.reduce<SourceType[]>((acc, item) => {
		if (typeof item !== 'object' || item === null) return []
		if (!('id' in item)) return []

		acc.push({
			id: isNumberOrDefault(item.id),
			name: isStringOrDefault(item.name, '')
		})

		return acc
	}, [])

	return sources
}

export async function putBanks(
	bankId: number,
	values: Partial<Omit<BankType, 'id'>>
) {
	await axiosInstance.put(`/banks/${bankId}`, values)
}

export async function deleteBanks(bankId: number) {
	await axiosInstance.delete(`/banks/${bankId}`)
}

export async function postOfxFile(formData: FormData) {
	await axiosInstance.post('/transactions', formData)
}
