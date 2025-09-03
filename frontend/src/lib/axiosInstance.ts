import axios from 'axios';

export const axiosInstance = axios.create({
	// Used for development
	baseURL: 'http://localhost:8247',
	timeout: 1000,
});
