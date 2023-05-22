import { axiosService } from './axiosClient';

export const getCartApi = (user_id) => {
    const url = `/cart/${user_id}`;
    return axiosService.get(url);
};

export const handleAddCartApi = (cartItem) => {
    const url = `/cart`;
    return axiosService.post(url, cartItem);
};

export const deleteCartApi = (id) => {
    const url = `/cart`;
    return axiosService.delete(url, { data: { id } });
};
