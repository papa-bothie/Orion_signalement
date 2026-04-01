import axios from 'axios';
import { CONFIG } from '../config/env';

export const apiClient = axios.create({
    baseURL: CONFIG.API_URL,
    timeout: 10000,
    headers: { 'Content-Type': 'application/json' },
});
