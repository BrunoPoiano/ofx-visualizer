import { axiosInstance } from '@/lib/axiosInstance'
import type { Params } from '../../types'
import { parseStatement, parseStatementObj } from './parsers'
import { parsePagination } from '@/lib/typeValidation'

export async function getStatesments(params?: Params) {
	const { data } = await axiosInstance.get('/statements', {
		params: params
	})

	return {
		data: parseStatement(data.data),
		paginationContent: parsePagination(data)
	}
}

export async function getStatesmentsInfo(bankId: string, params?: Params) {
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
