import api from './axios';

export const getSchedulesByCategory = async (categoryId) => {
  const res = await api.get(`/api/schedules?category_id=${categoryId}`);
  return res.data;
}; 