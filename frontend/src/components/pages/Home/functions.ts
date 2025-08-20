import { axiosInstance } from '@/lib/axiosInstance';
import { parsePagination } from '@/lib/typeValidation';
import {
	parseBanks,
	parseStatement,
	parseStatementObj,
	parseTransaction,
	parseTransactionInfo,
} from './parsers';

export const getTransactions = async (params?: Record<string, string>) => {
	const { data } = await axiosInstance.get('/transactions', {
		params: params,
	});

	return {
		data: parseTransaction(data),
		paginationContent: parsePagination(data),
	};
};

export const getTransactionsInfo = async (params?: Record<string, string>) => {
	const { data } = await axiosInstance.get('/transactions/info', {
		params: params,
	});

	return parseTransactionInfo(data);
};

export const getStatesments = async (params?: Record<string, string>) => {
	const { data } = await axiosInstance.get('/statements', {
		params: params,
	});

	return {
		data: parseStatement(data.data),
		paginationContent: parsePagination(data),
	};
};

export const getStatesmentsInfo = async (
	bankId: string,
	params?: Record<string, string>,
) => {
	const { data } = await axiosInstance.get(`/statements/${bankId}/info`, {
		params: params,
	});

	if (!data.currentBalance || !data.currentBalance) {
		throw new Error('No content');
	}

	return {
		currentBalance: parseStatementObj(data.currentBalance),
		largestBalance: parseStatementObj(data.largestBalance),
	};
};

export const getBanks = async (params?: Record<string, string>) => {
	const { data } = await axiosInstance.get('/banks', {
		params: params,
	});

	return {
		data: parseBanks(data),
		paginationContent: parsePagination(data),
	};
};

export const postOfxFile = async (formData: FormData) => {
	await axiosInstance.post('/transactions', formData);
};
