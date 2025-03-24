import axios from 'axios';

const API_URL = process.env.REACT_APP_BASE_URL+"/doubts" // Update with your backend URL

export const getDoubtsByCourse = (courseId) => {
  return axios.get(`${API_URL}/course/${courseId}`);
};

export const createDoubt = (doubtData,token) => {
  console.log("eafeafaef",doubtData)
  return axios.post(`${API_URL}/`, doubtData);
};

export const addReply = (doubtId, replyData,token) => {
  return axios.post(`${API_URL}/${doubtId}/reply`, replyData);
};

export const markDoubtResolved = (doubtId) => {
  return axios.put(`${API_URL}/${doubtId}/resolve`);
};

export const upvoteDoubt = (doubtId,token) => {
  console.log("Token....",token)

  return axios.post(`${API_URL}/${doubtId}/upvote`, { token: token });
};
