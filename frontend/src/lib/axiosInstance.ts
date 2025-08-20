import axios from 'axios';

export const axiosInstance = axios.create({
	baseURL: 'http://localhost:8247',
	timeout: 1000,
});
