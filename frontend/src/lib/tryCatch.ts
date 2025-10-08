export const tryCatch = async <T, E extends Error>(func: Promise<T>) => {
	try {
		const response = await func;
		return [response, null] as const;
	} catch (error) {
		return [null, error as E] as const;
	}
};
