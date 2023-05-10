import { axiosService } from './axiosClient';

export const catalogApi = (slug) => {
    if (!slug) {
        const url = `/catalog`;
        return axiosService.get(url);
    } else {
        const url = `/catalog/${slug}`;
        return axiosService.get(url);
    }
};
