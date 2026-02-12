import { axiosInstance } from '@/lib/axiosInstance'
import type { BankType, Params } from '../../types'
import { parseBanks } from './parsers'
import { parsePagination } from '@/lib/typeValidation'

export async function getBanks(params?: Params) {
	const { data } = await axiosInstance.get('/banks', {
		params: params
	})

	return {
		data: parseBanks(data),
		paginationContent: parsePagination(data)
	}
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
