import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { fetchExamResults } from '../../../services/operations/examAPI';
import { generateCertificate } from "../../../services/operations/certificateAPI";
import { BiArrowBack } from 'react-icons/bi';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { RiMedalLine } from 'react-icons/ri';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function ExamResults() {
  const { courseId } = useParams();
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getExamResults = async () => {
      try {
        setLoading(true);
        const response = await fetchExamResults(courseId, token);
        console.log("Exam results API response:", response);
        
        // Check the structure of the response
        if (response && response.result) {
          console.log("Setting results to:", response.result);
          setResults(response.result);
        } else {
          console.error("Unexpected response structure:", response);
          setResults(response); // Fallback
        }
      } catch (err) {
        console.error("Error fetching exam results:", err);
        setError("Failed to load exam results. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (courseId && token) {
      getExamResults();
    }
  }, [courseId, token]);

  const handleGenerateCertificate = async () => {
    try {
      // Show loading toast
      toast.loading("Generating your certificate...");
      
      // Log the results to check the structure
      console.log("Generating certificate with results:", results);
      
      // Check for examResultId in different possible locations
      const examResultId = results.examResultId || results._id;
      
      if (!examResultId) {
        toast.dismiss();
        toast.error("Could not find exam result ID");
        console.error("Exam result ID not found in:", results);
        return;
      }
      
      console.log("Using exam result ID:", examResultId);
      
      const response = await generateCertificate(examResultId, token);
      console.log("Certificate generation response:", response);
      
      toast.dismiss();
      
      if (response.success) {
        toast.success("Certificate generated successfully!");
        // Navigate after a short delay to ensure toast is visible
        setTimeout(() => {
          navigate(`/certificate/view/${response.data._id}`);
        }, 1000);
      } else {
        toast.error(response.message || "Failed to generate certificate");
      }
    } catch (error) {
      toast.dismiss();
      console.error("Error generating certificate:", error);
      toast.error(error.message || "Failed to generate certificate");
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center bg-white">
        <div className="animate-spin h-8 w-8 border-4 border-[#3B82F6] border-t-transparent rounded-full"></div>
        <p className="text-[#1E293B] ml-3 font-medium">Loading your results...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[calc(100vh-3.5rem)] px-4 flex flex-col items-center justify-center bg-white">
        <p className="text-[#EF4444] text-lg">{error}</p>
        <Link 
          to={`/view-course/${courseId}`} 
          className="mt-4 flex items-center gap-2 bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#1E293B] px-4 py-2 rounded-lg transition-all"
        >
          <BiArrowBack /> Return to Course
        </Link>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="min-h-[calc(100vh-3.5rem)] px-4 flex flex-col items-center justify-center bg-white">
        <p className="text-[#1E293B] text-lg">No exam results found.</p>
        <Link 
          to={`/view-course/${courseId}`}
          className="mt-4 flex items-center gap-2 bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#1E293B] px-4 py-2 rounded-lg transition-all"
        >
          <BiArrowBack /> Return to Course
        </Link>
      </div>
    );
  }

  const percentage = Math.round((results.scoredPoints / results.totalPoints) * 100);
  const isPassed = results.passed;

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-[#F8FAFC] px-4 py-10">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto"
      >
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-[#1E293B]">Exam Results</h1>
          <Link 
            to={`/view-course/${courseId}`}
            className="flex items-center gap-2 bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#1E293B] px-4 py-2 rounded-lg transition-all"
          >
            <BiArrowBack /> Return to Course
          </Link>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-[#E2E8F0]">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 border-b border-[#E2E8F0] pb-6">
            <div>
              <p className="text-sm text-[#64748B]">Student</p>
              <p className="text-[#1E293B] font-medium">{user?.firstName} {user?.lastName}</p>
            </div>
            <div className="flex items-center mt-4 md:mt-0">
              {isPassed ? (
                <div className="flex items-center gap-2 bg-[#F0FDF4] text-[#16A34A] px-3 py-1 rounded border border-[#DCFCE7]">
                  <FaCheckCircle />
                  <span className="font-medium">PASSED</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 bg-[#FEF2F2] text-[#DC2626] px-3 py-1 rounded border border-[#FEE2E2]">
                  <FaTimesCircle />
                  <span className="font-medium">FAILED</span>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-[#F8FAFC] p-4 rounded-lg border border-[#E2E8F0]">
              <p className="text-sm text-[#64748B]">Score</p>
              <p className="text-xl font-bold text-[#1E293B]">
                {results.scoredPoints} / {results.totalPoints}
              </p>
            </div>
            <div className="bg-[#F8FAFC] p-4 rounded-lg border border-[#E2E8F0]">
              <p className="text-sm text-[#64748B]">Percentage</p>
              <p className="text-xl font-bold text-[#1E293B]">{percentage}%</p>
            </div>
            <div className="bg-[#F8FAFC] p-4 rounded-lg border border-[#E2E8F0]">
              <p className="text-sm text-[#64748B]">Result</p>
              <p className={`text-xl font-bold ${isPassed ? 'text-[#16A34A]' : 'text-[#DC2626]'}`}>
                {isPassed ? 'Pass' : 'Fail'}
              </p>
            </div>
          </div>

          {results.reviewDetails && results.reviewDetails.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-[#1E293B] mb-4">Question Review</h3>
              <div className="space-y-4">
                {results.reviewDetails.map((item, index) => (
                  <div key={index} className="bg-[#F8FAFC] p-4 rounded-lg border border-[#E2E8F0]">
                    <div className="flex justify-between items-start mb-2">
                      <p className="text-[#1E293B] font-medium">Question {index + 1}</p>
                      <span className={`px-2 py-1 rounded text-xs ${
                        item.isCorrect 
                          ? 'bg-[#F0FDF4] text-[#16A34A] border border-[#DCFCE7]' 
                          : 'bg-[#FEF2F2] text-[#DC2626] border border-[#FEE2E2]'
                      }`}>
                        {item.isCorrect ? 'Correct' : 'Incorrect'}
                      </span>
                    </div>
                    <p className="text-[#334155] mb-2">{item.question}</p>
                    <div className="text-sm">
                      <p className="text-[#64748B]">Your answer: <span className="text-[#1E293B]">{item.yourAnswer || 'Not answered'}</span></p>
                      {!item.isCorrect && (
                        <p className="text-[#64748B] mt-1">Correct answer: <span className="text-[#16A34A] font-medium">{item.correctAnswer}</span></p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {isPassed && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mt-8 text-center"
            >
              <div className="inline-flex items-center gap-2 bg-[#F0FDF4] text-[#16A34A] px-4 py-3 rounded-lg border border-[#DCFCE7]">
                <RiMedalLine size={24} />
                <p>Congratulations! You have passed the exam and earned your certificate.</p>
              </div>
              <div className="mt-4">
                <button 
                  onClick={handleGenerateCertificate}
                  className="bg-[#3B82F6] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#2563EB] transition-all"
                >
                  Generate Certificate
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}