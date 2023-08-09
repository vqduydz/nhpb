import { axiosService } from './axiosClient';

export const tableApi = (query) => {
  const url = `/table`;
  return axiosService.get(url, { params: { ...query } });
};

export const createNewtableApi = (datatable) => {
  const url = `/table`;
  return axiosService.post(url, datatable);
};

export const updatetableApi = (dataUpdate) => {
  const url = `/table`;
  return axiosService.patch(url, dataUpdate);
};

export const deletetableApi = (id) => {
  const url = `/table`;
  return axiosService.delete(url, { data: { id } });
};

export const importtablesApi = (formData) => {
  const url = `/table/import`;
  return axiosService.post(url, formData);
};
