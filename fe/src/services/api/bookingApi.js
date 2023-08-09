import { axiosService } from './axiosClient';

export const getBookingApi = (query) => {
  const url = `/booking`;
  return axiosService.get(url, { params: { ...query } });
};

export const createNewBookingApi = (bookingData) => {
  const url = `/booking`;
  return axiosService.post(url, bookingData);
};

export const updateBookingApi = (dataUpdate) => {
  const url = `/booking`;
  return axiosService.patch(url, dataUpdate);
};

export const deleteBookingApi = (id) => {
  const url = `/booking`;
  return axiosService.delete(url, { data: { id } });
};

export const importBookingsApi = (formData) => {
  const url = `/booking/import`;
  return axiosService.post(url, formData);
};
