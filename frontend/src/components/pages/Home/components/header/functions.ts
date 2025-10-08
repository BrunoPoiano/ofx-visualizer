import { axiosInstance } from '@/lib/axiosInstance'

export const postOfxFile = async (formData: FormData): Promise<void> => {
	await axiosInstance.post('/transactions', formData)
}
