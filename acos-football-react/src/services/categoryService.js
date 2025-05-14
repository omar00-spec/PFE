import api from './axios'; // tu as déjà axios configuré

export const getCategoryByName = async (name) => {
  const res = await api.get(`/api/categories?name=${name}`);
  return res.data;
};
