import axios from 'axios';

export const setupAxiosInterceptors = (logoutCallback: () => void) => {
    // Set your Spring Boot API base URL here
    axios.defaults.baseURL = 'https://backend-541923942410.us-east1.run.app/api/v1';

    // Request Interceptor: Attach the token
    axios.interceptors.request.use((config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    }, (error) => Promise.reject(error));

    // Response Interceptor: Handle 401s globally
    axios.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response && error.response.status === 401) {
                console.warn('Unauthorized! Logging out...');
                logoutCallback();
            }
            return Promise.reject(error);
        }
    );
};