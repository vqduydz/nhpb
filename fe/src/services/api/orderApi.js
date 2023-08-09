import { axiosService } from './axiosClient';

// export const getOrderApi = (customer_id) => {
//   if (!customer_id) {
//     const url = `/orders`;
//     return axiosService.get(url);
//   } else {
//     const url = `/orders/${customer_id}`;
//     return axiosService.get(url);
//   }
// };

export const getOrderApi = (query) => {
  const url = `/orders`;
  return axiosService.get(url, { params: { ...query } });
};

export const getOrderByOrderCodeApi = (order_code) => {
  const url = `/order/${order_code}`;
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
