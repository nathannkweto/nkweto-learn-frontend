import axios from 'axios';

axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;

export const setupAxiosInterceptors = (logoutCallback: () => void) => {
    axios.interceptors.request.clear();
    axios.interceptors.response.clear();

    axios.interceptors.request.use((config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.set('Authorization', `Bearer ${token}`);
        }
        return config;
    }, (error) => Promise.reject(error));

    axios.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response?.status === 401) {
                logoutCallback();
            }
            return Promise.reject(error);
        }
    );
};