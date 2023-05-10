import { axiosService } from '_/services/api/axiosClient';

export const handleLogin = (email, password) => {
    return axiosService.post('/login', { email, password });
};
