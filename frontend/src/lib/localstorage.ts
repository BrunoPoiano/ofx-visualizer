import { useEffect, useState } from 'react'

const useLocalStorage = <T>(
	key: string,
	initialValue: T,
): [value: T, setValue: React.Dispatch<React.SetStateAction<T>>] => {
	const [storedValue, setStoredValue] = useState<T>(() => {
		if (typeof window === 'undefined') {
			return initialValue
		}
		try {
			const item = window.localStorage.getItem(key)
			return item ? JSON.parse(item) : initialValue
		} catch (error) {
			console.error(error)
			return initialValue
		}
	})

	const setValue = (value: unknown) => {
		try {
			const valueToStore =
				value instanceof Function ? value(storedValue) : value
			setStoredValue(valueToStore)
			if (typeof window !== 'undefined') {
				window.localStorage.setItem(key, JSON.stringify(valueToStore))
				window.dispatchEvent(
					new CustomEvent('storage-update', { detail: { key, value } }),
				)
			}
		} catch (error) {
			console.error(error)
		}
	}

	useEffect(() => {
		if (typeof window !== 'undefined') {
			try {
				const item = window.localStorage.getItem(key)
				if (item) {
					setStoredValue(JSON.parse(item))
				}
			} catch (error) {
				console.error(error)
			}
		}
	}, [key])

	return [storedValue, setValue]
}

export default useLocalStorage
