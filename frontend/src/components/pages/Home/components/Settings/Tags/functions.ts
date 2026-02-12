import { axiosInstance } from '@/lib/axiosInstance'
import type { Params } from '../../../types'
import { parsePagination } from '@/lib/typeValidation'
import { parseTags } from './parsers'

export async function getTags(params?: Params) {
	const { data } = await axiosInstance.get('/tags', {
		params: params
	})

	return {
		data: parseTags(data.data),
		paginationContent: parsePagination(data)
	}
}

export async function postTags(name: string) {
	await axiosInstance.post('/tags', {
		name
	})
}

export async function deleteTags(id: number) {
	await axiosInstance.delete(`/tags/${id}`)
}
