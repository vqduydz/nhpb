import { axiosService } from './axiosClient';

export const cartApi = (user_id) => {
    const url = `/cart/${user_id}`;
    return axiosService.get(url);
};
