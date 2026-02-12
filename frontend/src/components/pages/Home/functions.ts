import { axiosInstance } from '@/lib/axiosInstance'
import { parseSource } from './parsers'

export async function getSources() {
	const { data } = await axiosInstance.get('/source')
	return parseSource(data)
}

export async function postOfxFile(formData: FormData) {
	await axiosInstance.post('/transactions', formData)
}
