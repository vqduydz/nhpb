import { axiosService } from './axiosClient';

export const getCartApi = (customer_id) => {
  const url = `/cart/${customer_id}`;
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
