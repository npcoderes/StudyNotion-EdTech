import { apiConnector } from "../apiconnector";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:4000";
const examEndpoints = {
  SUBMIT_EXAM: BASE_URL + "/exams/submit",
  FETCH_EXAM_RESULTS: BASE_URL + "/exams/results",
};

export const submitExam = async (examData, token) => {
  try {
    const response = await apiConnector(
      "POST",
      examEndpoints.SUBMIT_EXAM,
      examData,
      {
        Authorization: `Bearer ${token}`,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error submitting exam:", error);
    throw error;
  }
};

export const fetchExamResults = async (courseId, token) => {
  try {
    const response = await apiConnector(
      "GET",
      `${examEndpoints.FETCH_EXAM_RESULTS}/${courseId}`,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    );
    
    console.log("Exam results raw response:", response);
    
    if (response.data && response.data.success) {
      return response.data.result;
    } else {
      throw new Error(response.data?.message || "Failed to fetch exam results");
    }
  } catch (error) {
    console.error("Error fetching exam results:", error);
    throw error;
  }
};