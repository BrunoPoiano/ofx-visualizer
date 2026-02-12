export const isDirty = <T extends object>(base: T, newValue: T) =>
	Object.entries(newValue).some(
		(item) => base[item[0] as keyof typeof base] !== item[1]
	)
