import { type ClassValue, clsx } from 'clsx'
import moment from 'moment'
import { twMerge } from 'tailwind-merge'

export function returnCardTextColor(value?: number): string {
	if (!value || value === 0) {
		return 'var(--chart-1)'
	}

	return value > 0 ? 'var(--chart-2)' : 'var(--destructive)'
}

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function parseDate(date: string, date2?: string): string {
	if (date2) {
		return `${moment.utc(date).format('DD/MM/yyyy')} to ${moment
			.utc(date2)
			.format('DD/MM/yyyy')}`
	}

	return moment.utc(date).format('DD/MM/yyyy')
}

export function generateKey(length = 5) {
	let len = length

	if (len < 5) {
		len += 5
	} else if (len > 10) {
		len = 10
	}

	const char = 'abcdefghijklmnopqrstuvwxyz123456789!@#$%^&^*('
	let result = ''
	for (let i = 0; i < len; i++) {
		result += char.charAt(Math.floor(Math.random() * char.length))
	}
	return result
}

export function isOneOf<T extends string>(
	value: T,
	array: T[] | readonly T[]
): value is T {
	return array.includes(value as T)
}

export function ensureOneOf<T extends readonly (string | number)[]>(
	value: unknown,
	array: T,
	def: T[number]
): T[number] {
	if (!array.includes(value as T[number])) {
		return def
	}
	return value as T[number]
}

export function formatMoney(value: number): string {
	return value.toLocaleString('pt-BR', {
		style: 'currency',
		currency: 'BRL'
	})
}
