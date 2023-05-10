import { axiosService } from './axiosClient';

export const menuApi = (slug) => {
    if (!slug) {
        const url = `/menu`;
        return axiosService.get(url);
    } else {
        const url = `/menu/${slug}`;
        return axiosService.get(url);
    }
};

export const createNewMenuApi = (dataMenu) => {
    const url = `/menu`;
    return axiosService.post(url, dataMenu);
};

export const updateMenuApi = (dataUpdate) => {
    const url = `/menu`;
    return axiosService.patch(url, dataUpdate);
};

export const deleteMenuApi = (id) => {
    const url = `/menu`;
    return axiosService.delete(url, { data: { id } });
};
