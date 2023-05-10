import axios from 'axios';
import { axiosService } from './axiosClient';

export const userApi = (id) => {
    if (!id) {
        const url = `/user`;
        return axiosService.get(url);
    } else {
        const url = `/user?id=${id}`;
        return axiosService.get(url);
    }
};

export const getTokenApi = (param) => {
    const url = `${process.env.REACT_APP_API_ENDPOINT}/login`;
    return axios.post(url, param);
};

export const loginApi = () => {
    const url = '/login';
    return axiosService.get(url);
};

export const forgotPasswordApi = (param) => {
    const url = '/forgot-password';
    return axiosService.post(url, param);
};

export const resetPasswordApi = (token, password) => {
    const url = `reset-password/${token}`;
    return axiosService.patch(url, password);
};

export const createNewUserApi = (dataUser) => {
    const url = `/user`;
    return axiosService.post(url, dataUser);
};

export const updateUserApi = (dataUpdate) => {
    const url = `/user`;
    return axiosService.patch(url, dataUpdate);
};

export const deleteUserApi = (id) => {
    const url = `/user`;
    return axiosService.delete(url, { data: { id } });
};
