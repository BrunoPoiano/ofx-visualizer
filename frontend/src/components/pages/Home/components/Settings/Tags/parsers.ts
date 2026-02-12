import {
	isNumberOrDefault,
	isObject,
	isStringOrDefault
} from '@/lib/typeValidation'
import type { TagType } from '../../../types'

export function parseTags(data: unknown): TagType[] {
	if (!Array.isArray(data)) return []

	return data.reduce<TagType[]>((prev, item) => {
		if (!isObject(item)) {
			return prev
		}
		const id = isNumberOrDefault(item.id)
		if (!id) {
			return prev
		}

		const newItem: TagType = {
			id,
			name: isStringOrDefault(item.name)
		}

		prev.push(newItem)
		return prev
	}, [])
}
