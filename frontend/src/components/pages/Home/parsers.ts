import moment from 'moment'
import type { DateRange } from 'react-day-picker'
import type { SourceType } from './types'
import {
	isNumberOrDefault,
	isObject,
	isStringOrDefault
} from '@/lib/typeValidation'

export function parseFilterDate(date: DateRange | undefined):
	| {
			from: string
			to: string | undefined
	  }
	| undefined {
	if (!date) return
	const from = moment(date.from).format('yyyy-MM-DD')
	const to = date.to ? moment(date.to).format('yyyy-MM-DD') : undefined
	return { from, to }
}

export function parseSource(data: unknown) {
	if (!Array.isArray(data)) return []

	return data.reduce<SourceType[]>((acc, item) => {
		if (!isObject(item)) return []

		const id = isNumberOrDefault(item.id)
		if (!id) return []

		acc.push({
			id,
			name: isStringOrDefault(item.name, '')
		})

		return acc
	}, [])
}
