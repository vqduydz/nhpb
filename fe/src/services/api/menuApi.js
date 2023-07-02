import { axiosService } from './axiosClient';

export const menuApi = (query) => {
  const url = `/menu`;
  return axiosService.get(url, { params: { ...query } });
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

export const importMenusApi = (formData) => {
  const url = `/menu/import`;
  return axiosService.post(url, formData);
};
