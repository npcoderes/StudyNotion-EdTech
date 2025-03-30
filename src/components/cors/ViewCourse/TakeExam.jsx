import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { submitExam } from "../../../services/operations/examAPI";
import { FaRegClock, FaRegCheckCircle, FaRegQuestionCircle } from "react-icons/fa";
import { motion } from "framer-motion";

export default function TakeExam() {
  const { courseEntireData } = useSelector((state) => state.viewCourse);
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const exam = courseEntireData?.exam;

  if (!exam) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-lg border border-[#E2E8F0] shadow-sm">
        <FaRegQuestionCircle className="text-4xl text-[#94A3B8] mb-3" />
        <p className="text-center text-[#64748B] font-medium">No exam available for this course.</p>
      </div>
    );
  }

  const handleAnswerChange = (questionId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length !== exam.questions.length) {
      toast.error("Please answer all questions before submitting.");
      return;
    }

    setLoading(true);
    try {
      const response = await submitExam(
        {
          courseId: courseEntireData._id,
          answers,
        },
        token
      );

      if (response.success) {
        toast.success("Exam submitted successfully!");
        navigate(`/view-course/${courseEntireData._id}/exam-results`);
      } else {
        toast.error(response.message || "Failed to submit the exam.");
      }
    } catch (error) {
      console.error("Error submitting exam:", error);
      toast.error("An error occurred while submitting the exam.");
    } finally {
      setLoading(false);
    }
  };

  const navigateQuestion = (direction) => {
    if (direction === 'next' && currentQuestionIndex < exam.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else if (direction === 'prev' && currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  return (
    <div className="p-6 bg-white text-[#1E293B] rounded-lg border border-[#E2E8F0] shadow-sm">
      {/* Exam Header */}
      <div className="mb-8 border-b border-[#E2E8F0] pb-4">
        <h1 className="text-2xl font-bold mb-2">{exam.title}</h1>
        <p className="text-[#64748B] mb-3">{exam.description}</p>
        
        <div className="flex flex-wrap items-center gap-4 mt-4 text-sm">
          <div className="bg-[#F1F5F9] text-[#334155] px-3 py-1.5 rounded-full flex items-center gap-1.5">
            <FaRegClock className="text-[#3B82F6]" />
            <span>{exam.questions.length} questions</span>
          </div>
          
          <div className="bg-[#F1F5F9] text-[#334155] px-3 py-1.5 rounded-full flex items-center gap-1.5">
            <FaRegCheckCircle className="text-[#3B82F6]" />
            <span>
              {Object.keys(answers).length}/{exam.questions.length} answered
            </span>
          </div>
        </div>
      </div>

      {/* Question Navigation */}
      <div className="mb-6 flex flex-wrap gap-2">
        {exam.questions.map((_, i) => (
          <button 
            key={i}
            onClick={() => setCurrentQuestionIndex(i)}
            className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium
              ${i === currentQuestionIndex 
                ? 'bg-[#3B82F6] text-white' 
                : answers[exam.questions[i]._id] 
                  ? 'bg-[#DBEAFE] text-[#3B82F6] border border-[#93C5FD]' 
                  : 'bg-[#F1F5F9] text-[#64748B]'}`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* Current Question */}
      <motion.div 
        key={currentQuestionIndex}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-[#F8FAFC] rounded-lg p-6 border border-[#E2E8F0] mb-6"
      >
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2">
            <span className="bg-[#3B82F6] text-xs font-medium px-2.5 py-1 rounded-full text-white">
              Q{currentQuestionIndex + 1}
            </span>
            <span className="bg-[#F1F5F9] text-xs px-2.5 py-1 rounded-full text-[#475569] font-medium">
              {exam.questions[currentQuestionIndex].points} {exam.questions[currentQuestionIndex].points > 1 ? "points" : "point"}
            </span>
          </div>
        </div>
        
        <p className="font-medium mb-6 text-[#1E293B] text-lg">
          {exam.questions[currentQuestionIndex].question}
        </p>

        {/* MCQ Options */}
        {exam.questions[currentQuestionIndex].type === "mcq" && (
          <div className="space-y-3">
            {exam.questions[currentQuestionIndex].options.map((option, i) => (
              <label 
                key={i} 
                className={`flex items-center gap-3 p-3 rounded-lg border transition-all
                  ${answers[exam.questions[currentQuestionIndex]._id] === option.text 
                    ? 'border-[#3B82F6] bg-[#EFF6FF]' 
                    : 'border-[#E2E8F0] hover:border-[#CBD5E1] bg-white'}`}
              >
                <div className="relative">
                  <input
                    type="radio"
                    name={`question-${exam.questions[currentQuestionIndex]._id}`}
                    value={option.text}
                    checked={answers[exam.questions[currentQuestionIndex]._id] === option.text}
                    onChange={() => handleAnswerChange(exam.questions[currentQuestionIndex]._id, option.text)}
                    className="w-4 h-4 cursor-pointer text-[#3B82F6] border-[#94A3B8] focus:ring-[#3B82F6]"
                  />
                </div>
                <span className="text-[#334155]">{option.text}</span>
              </label>
            ))}
          </div>
        )}

        {/* True/False Options */}
        {exam.questions[currentQuestionIndex].type === "truefalse" && (
          <div className="grid grid-cols-2 gap-4">
            <label 
              className={`flex items-center gap-3 p-4 rounded-lg border transition-all text-center justify-center
                ${answers[exam.questions[currentQuestionIndex]._id] === "True" 
                  ? 'border-[#3B82F6] bg-[#EFF6FF]' 
                  : 'border-[#E2E8F0] hover:border-[#CBD5E1] bg-white'}`}
            >
              <input
                type="radio"
                name={`question-${exam.questions[currentQuestionIndex]._id}`}
                value="True"
                checked={answers[exam.questions[currentQuestionIndex]._id] === "True"}
                onChange={() => handleAnswerChange(exam.questions[currentQuestionIndex]._id, "True")}
                className="w-4 h-4 cursor-pointer text-[#3B82F6] border-[#94A3B8] focus:ring-[#3B82F6]"
              />
              <span className="font-medium text-[#334155]">True</span>
            </label>
            
            <label 
              className={`flex items-center gap-3 p-4 rounded-lg border transition-all text-center justify-center
                ${answers[exam.questions[currentQuestionIndex]._id] === "False" 
                  ? 'border-[#3B82F6] bg-[#EFF6FF]' 
                  : 'border-[#E2E8F0] hover:border-[#CBD5E1] bg-white'}`}
            >
              <input
                type="radio"
                name={`question-${exam.questions[currentQuestionIndex]._id}`}
                value="False"
                checked={answers[exam.questions[currentQuestionIndex]._id] === "False"}
                onChange={() => handleAnswerChange(exam.questions[currentQuestionIndex]._id, "False")}
                className="w-4 h-4 cursor-pointer text-[#3B82F6] border-[#94A3B8] focus:ring-[#3B82F6]"
              />
              <span className="font-medium text-[#334155]">False</span>
            </label>
          </div>
        )}

        {/* Short Answer */}
        {exam.questions[currentQuestionIndex].type === "shortAnswer" && (
          <textarea
            placeholder="Type your answer here..."
            value={answers[exam.questions[currentQuestionIndex]._id] || ''}
            onChange={(e) => handleAnswerChange(exam.questions[currentQuestionIndex]._id, e.target.value)}
            className="w-full p-3 bg-white border border-[#CBD5E1] rounded-lg focus:ring-2 focus:ring-[#3B82F6] focus:border-[#3B82F6] outline-none transition min-h-[120px] text-[#334155]"
          />
        )}
      </motion.div>

      {/* Navigation Controls */}
      <div className="flex justify-between mb-8">
        <button
          onClick={() => navigateQuestion('prev')}
          disabled={currentQuestionIndex === 0}
          className={`px-4 py-2 rounded-lg font-medium transition-all
            ${currentQuestionIndex === 0 
              ? 'bg-[#F1F5F9] text-[#94A3B8] cursor-not-allowed' 
              : 'bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0]'}`}
        >
          Previous Question
        </button>
        
        <button
          onClick={() => navigateQuestion('next')}
          disabled={currentQuestionIndex === exam.questions.length - 1}
          className={`px-4 py-2 rounded-lg font-medium transition-all
            ${currentQuestionIndex === exam.questions.length - 1 
              ? 'bg-[#F1F5F9] text-[#94A3B8] cursor-not-allowed' 
              : 'bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0]'}`}
        >
          Next Question
        </button>
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={loading || Object.keys(answers).length !== exam.questions.length}
        className={`mt-6 w-full py-3 px-4 rounded-lg font-semibold transition-all text-center
          ${loading || Object.keys(answers).length !== exam.questions.length
            ? 'bg-[#E2E8F0] text-[#94A3B8] cursor-not-allowed'
            : 'bg-[#3B82F6] text-white hover:bg-[#2563EB] shadow-sm'}`}
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
            <span>Submitting...</span>
          </div>
        ) : (
          `Submit Exam (${Object.keys(answers).length}/${exam.questions.length})`
        )}
      </button>
    </div>
  );
}