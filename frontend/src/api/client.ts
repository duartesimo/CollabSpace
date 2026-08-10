import axios from 'axios'
import * as authStorage from '../features/auth/authStorage'

const baseURL = import.meta.env.VITE_API_BASE_URL || '/api'

const client = axios.create({
	baseURL,
	headers: {
		'Content-Type': 'application/json',
	},
})

client.interceptors.request.use((config) => {
	const token = authStorage.getToken()
	if (token && config.headers) {
		config.headers.Authorization = `Bearer ${token}`
	}
	return config
})

export default client
