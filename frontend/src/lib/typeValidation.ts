import type { GenericObject } from '@/components/pages/Home/types'
import type { PaginationType } from '@/types'

export function isString(value: unknown): value is string {
	return typeof value === 'string'
}

export function isNumber(value: unknown): value is number {
	return typeof value === 'number'
}

export function notEmptyString(value: unknown): value is string {
	return isString(value) && value.trim() !== ''
}

export function isStringOrDefault(value: unknown, defaultValue = ''): string {
	if (notEmptyString(value)) return value.trim()
	if (isNumber(value)) return value.toString()

	return defaultValue
}

export function isNumberOrDefault<T extends number | undefined>(
	value: unknown,
	defaultValue?: T
): T extends number ? number : number | null {
	if (isNumber(value)) return value

	if (isString(value)) {
		const parsed = Number(value)
		if (!Number.isNaN(parsed)) {
			return parsed
		}
	}
	if (defaultValue !== undefined) {
		return defaultValue
	}

	return null as any
}

export function isBooleanOrDefault(
	value: unknown,
	defaultValue = false
): boolean {
	if (typeof value === 'boolean') return value
	if (value === 1 || value === '1' || value === 'true') return true
	if (value === 0 || value === '0' || value === 'false') return false

	return defaultValue
}

export function parsePagination(data: unknown): PaginationType {
	if (typeof data !== 'object' || data === null) {
		return {
			current_page: 1,
			per_page: 5,
			total_items: 0,
			last_page: 1
		}
	}

	const typedItem = data as Record<string, unknown>

	return {
		current_page: isNumberOrDefault(typedItem.current_page, 1),
		per_page: isNumberOrDefault(typedItem.per_page, 5),
		total_items: isNumberOrDefault(typedItem.total_items, 0),
		last_page: isNumberOrDefault(typedItem.last_page, 0)
	}
}

export function isObject(data: unknown): data is GenericObject {
	return data !== null && typeof data === 'object'
}
