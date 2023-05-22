import { axiosService } from './axiosClient';

export const getOrderApi = (user_id) => {
    const url = `/order/${user_id}`;
    return axiosService.get(url);
};

export const createNewOrderApi = (order) => {
    const url = `/order`;
    return axiosService.post(url, order);
};

export const updateOrderApi = (dataUpdate) => {
    const url = `/order`;
    return axiosService.patch(url, dataUpdate);
};

export const deleteOrderApi = (id) => {
    const url = `/order`;
    return axiosService.delete(url, { data: { id } });
};
