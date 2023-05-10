import { axiosService } from './axiosClient';

export const getCartItemApi = (user_id) => {
    const url = `/cartitem/${user_id}`;
    return axiosService.get(url);
};

export const handleAddToCartApi = (cartItem) => {
    const url = `/cartitem`;
    return axiosService.post(url, cartItem);
};

export const updateCartItemApi = (dataUpdate) => {
    const url = `/cartitem`;
    return axiosService.patch(url, dataUpdate);
};

export const deleteCartItemApi = (id) => {
    const url = `/cartitem`;
    return axiosService.delete(url, { data: { id } });
};
