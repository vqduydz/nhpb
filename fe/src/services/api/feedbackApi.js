import { axiosService } from './axiosClient';

export const getFeedbackApi = (feedback) => {
  const url = `/feedback`;
  return axiosService.get(url, { params: { ...feedback } });
};

export const createNewFeedbackApi = (feedback) => {
  const url = `/feedback`;
  return axiosService.post(url, feedback);
};

export const updateFeedbackApi = (dataUpdate) => {
  const url = `/feedback`;
  return axiosService.patch(url, dataUpdate);
};

export const deleteFeedbackApi = (id) => {
  const url = `/feedback`;
  return axiosService.delete(url, { data: { id } });
};
