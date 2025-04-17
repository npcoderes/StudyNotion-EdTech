import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import { MdNavigateNext } from 'react-icons/md';
import { BiArrowBack } from 'react-icons/bi';
import { IoMdAdd } from 'react-icons/io';
import { setStep, setCourse } from '../../../../../slices/courseSlice';
import IconBtn from '../../../../common/IconBtn';
import { toast } from 'react-hot-toast';
import QuestionModal from './QuestionModal';
import ExamQuestion from './ExamQuestion';
import { apiConnector } from '../../../../../services/apiconnector';
import { courseEndpoints } from '../../../../../services/apis';

export default function CourseExamForm() {
  const { register, handleSubmit, watch, setValue } = useForm();
  const { course } = useSelector((state) => state.course);
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [editQuestionIndex, setEditQuestionIndex] = useState(null);

  // Initialize form with existing values or defaults
  useEffect(() => {
    console.log("CourseExamForm mounted/updated", course);
    if (course?.exam) {
      setValue("examTitle", course.exam.title || "");
      setValue("examDescription", course.exam.description || "");
      setValue("timeLimit", course.exam.timeLimit || 60);
      setValue("passingScore", course.exam.passingScore || 70);
      setValue("showResults", course.exam.showResults !== false);
      setValue("randomizeQuestions", course.exam.randomizeQuestions || false);
      setValue("hasExam", course.hasExam || false);
      
      if (course.exam.questions && Array.isArray(course.exam.questions)) {
        console.log("Loading questions from course:", course.exam.questions.length);
        setQuestions(course.exam.questions);
      } else {
        console.log("No questions found in course");
        setQuestions([]);
      }
    } else {
      setValue("hasExam", false);
      setValue("timeLimit", 60);
      setValue("passingScore", 70);
      setValue("showResults", true);
      setQuestions([]);
    }
  }, [course, setValue]);

  const hasExam = watch("hasExam");

  // Functions to handle question operations
  const openAddQuestionModal = (e) => {
    if (e) e.preventDefault();
    console.log("Opening modal to add question");
    setEditQuestionIndex(null);
    setShowQuestionModal(true);
  };

  const openEditQuestionModal = (index) => {
    console.log("Opening modal to edit question", index);
    setEditQuestionIndex(index);
    setShowQuestionModal(true);
  };

  const closeQuestionModal = () => {
    console.log("Closing question modal");
    setShowQuestionModal(false);
    setEditQuestionIndex(null);
  };

  const handleSaveQuestion = (questionData) => {
    try {
      console.log("Saving question:", questionData);
      
      // Create a deep copy of the questions array to ensure state changes are detected
      const updatedQuestions = JSON.parse(JSON.stringify(questions));
      
      if (editQuestionIndex !== null) {
        updatedQuestions[editQuestionIndex] = questionData;
      } else {
        updatedQuestions.push(questionData);
      }
      
      console.log("Updated questions array:", updatedQuestions);
      setQuestions(updatedQuestions);
      closeQuestionModal();
      
      // Save the current state to Redux to prevent loss during navigation
      const updatedExamData = {
        title: watch("examTitle") || "",
        description: watch("examDescription") || "",
        timeLimit: parseInt(watch("timeLimit") || 60),
        passingScore: parseInt(watch("passingScore") || 70),
        showResults: watch("showResults") !== false,
        randomizeQuestions: watch("randomizeQuestions") || false,
        questions: updatedQuestions,
      };
      
      const updatedCourseData = {
        ...course,
        hasExam: true,
        exam: updatedExamData,
      };
      
      console.log("Updating course state with new questions:", updatedCourseData);
      dispatch(setCourse(updatedCourseData));
      
      toast.success(
        editQuestionIndex !== null
          ? "Question updated successfully"
          : "Question added successfully"
      );
    } catch (error) {
      console.error("Error saving question:", error);
      toast.error("Failed to save question");
    }
  };

  const handleRemoveQuestion = (index) => {
    if (window.confirm("Are you sure you want to remove this question?")) {
      const updatedQuestions = [...questions];
      updatedQuestions.splice(index, 1);
      setQuestions(updatedQuestions);
      
      // Update course in Redux to prevent loss during navigation
      const updatedExamData = {
        ...course.exam,
        questions: updatedQuestions,
      };
      
      dispatch(setCourse({
        ...course,
        exam: updatedExamData,
      }));
      
      toast.success("Question removed");
    }
  };

  const handleReorderQuestion = (index, direction) => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === questions.length - 1)
    ) {
      return;
    }

    const updatedQuestions = [...questions];
    const newIndex = direction === "up" ? index - 1 : index + 1;

    const temp = updatedQuestions[index];
    updatedQuestions[index] = updatedQuestions[newIndex];
    updatedQuestions[newIndex] = temp;

    setQuestions(updatedQuestions);
    
    // Update course in Redux
    const updatedExamData = {
      ...course.exam,
      questions: updatedQuestions,
    };
    
    dispatch(setCourse({
      ...course,
      exam: updatedExamData,
    }));
  };

  const goToNext = async (data) => {
    if (hasExam && questions.length === 0) {
      toast.error("Please add at least one question to your exam");
      return;
    }

    setLoading(true);

    try {
      const examData = hasExam
        ? {
            title: data.examTitle,
            description: data.examDescription,
            timeLimit: parseInt(data.timeLimit) || 60,
            passingScore: parseInt(data.passingScore) || 70,
            showResults: data.showResults !== false,
            randomizeQuestions: data.randomizeQuestions || false,
            questions: questions,
          }
        : null;

      const updatedCourseData = {
        ...course,
        hasExam: hasExam,
        exam: examData,
      };

      console.log("Saving to API:", updatedCourseData);
      
      // Save to API
      const response = await apiConnector(
        "POST",
        courseEndpoints.EDIT_COURSE_API,
        {
          courseId: course._id,
          hasExam: hasExam,
          exam: JSON.stringify(examData),
        },
        {
          Authorization: `Bearer ${token}`,
        }
      );
      
      console.log("API Response:", response);
      
      if (response.data.success) {
        // Update Redux state with API response
        dispatch(setCourse(response.data.data));
        dispatch(setStep(4)); // Go to Publish step
        toast.success("Course exam saved successfully");
      } else {
        toast.error(response.data.message || "Failed to save course exam");
      }
    } catch (error) {
      console.error("Error saving exam data:", error);
      toast.error("Failed to save exam data to server");
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    // Save current state before navigating
    const examData = hasExam
      ? {
          title: watch("examTitle") || "",
          description: watch("examDescription") || "",
          timeLimit: parseInt(watch("timeLimit") || 60),
          passingScore: parseInt(watch("passingScore") || 70),
          showResults: watch("showResults") !== false,
          randomizeQuestions: watch("randomizeQuestions") || false,
          questions: questions,
        }
      : null;

    dispatch(setCourse({
      ...course,
      hasExam: hasExam,
      exam: examData,
    }));
    
    dispatch(setStep(2)); // Go back to Course Builder
  };

  return (
    <form onSubmit={handleSubmit(goToNext)} className="space-y-8">
      <div className="bg-white rounded-lg border border-[#E2E8F0] p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-1 text-[#1E293B]">
            Add an Exam to Your Course
          </h2>
          <p className="text-[#64748B] text-sm">
            Create an assessment to test your students' knowledge and make it a requirement for certification
          </p>
        </div>

        <div className="mb-6">
          <div className="flex items-center gap-2">
            <input
              id="hasExam"
              type="checkbox"
              className="w-4 h-4 accent-[#3B82F6]"
              {...register("hasExam")}
            />
            <label htmlFor="hasExam" className="text-[#1E293B] font-medium">
              Include an exam in this course
            </label>
          </div>
          <p className="text-xs text-[#64748B] mt-1 ml-6">
            Students must pass this exam to receive their course completion certificate
          </p>
        </div>

        {hasExam && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm text-[#334155] mb-1 block">
                  Exam Title <span className="text-[#E11D48]">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter exam title"
                  {...register("examTitle", {
                    required: hasExam ? "Exam title is required" : false,
                  })}
                  className="w-full bg-[#F8FAFC] text-[#334155] rounded-lg p-3 border border-[#E2E8F0] focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] outline-none"
                />
              </div>
              <div>
                <label className="text-sm text-[#334155] mb-1 block">Time Limit (minutes)</label>
                <input
                  type="number"
                  min="5"
                  {...register("timeLimit")}
                  className="w-full bg-[#F8FAFC] text-[#334155] rounded-lg p-3 border border-[#E2E8F0] focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-[#334155] mb-1 block">Exam Description</label>
              <textarea
                placeholder="Provide a description of the exam"
                {...register("examDescription")}
                className="w-full bg-[#F8FAFC] text-[#334155] rounded-lg p-3 border border-[#E2E8F0] focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] outline-none min-h-[80px]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm text-[#334155] mb-1 block">
                  Passing Score (%)
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  {...register("passingScore")}
                  className="w-full bg-[#F8FAFC] text-[#334155] rounded-lg p-3 border border-[#E2E8F0] focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] outline-none"
                />
              </div>
              {/* <div className="flex flex-col md:flex-row gap-4 md:mt-6">
                <div className="flex items-center">
                  <input
                    id="showResults"
                    type="checkbox"
                    className="w-4 h-4 mr-2 accent-[#3B82F6]"
                    {...register("showResults")}
                  />
                  <label htmlFor="showResults" className="text-sm text-[#334155]">
                    Show results immediately
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="randomizeQuestions"
                    type="checkbox"
                    className="w-4 h-4 mr-2 accent-[#3B82F6]"
                    {...register("randomizeQuestions")}
                  />
                  <label htmlFor="randomizeQuestions" className="text-sm text-[#334155]">
                    Randomize questions
                  </label>
                </div>
              </div> */}
            </div>

            <div className="mt-8 border-t border-[#E2E8F0] pt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-[#1E293B] font-semibold">
                  Exam Questions {questions.length > 0 && `(${questions.length})`}
                </h3>
                <button
                  type="button"
                  onClick={openAddQuestionModal}
                  className="bg-[#3B82F6] text-white py-2 px-3 rounded-lg flex items-center gap-1 text-sm font-medium transition-all hover:bg-[#2563EB]"
                >
                  <IoMdAdd /> Add Question
                </button>
              </div>

              {questions.length === 0 ? (
                <div className="bg-[#F8FAFC] rounded-lg p-6 text-center border border-dashed border-[#CBD5E1]">
                  <p className="text-[#64748B]">
                    No questions added yet. Click 'Add Question' to create your first question.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {questions.map((question, index) => (
                    <ExamQuestion
                      key={index}
                      question={question}
                      index={index}
                      onEdit={() => openEditQuestionModal(index)}
                      onRemove={() => handleRemoveQuestion(index)}
                      onReorder={handleReorderQuestion}
                      totalQuestions={questions.length}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={goBack}
          className="flex items-center gap-2 bg-[#F1F5F9] hover:bg-[#E2E8F0] transition-all text-[#334155] py-2 px-4 rounded-lg font-medium"
        >
          <BiArrowBack /> Back
        </button>
        <button
          type="submit"
          disabled={loading}
          className={`flex items-center gap-2 bg-[#3B82F6] hover:bg-[#2563EB] transition-all text-white py-2 px-6 rounded-lg font-medium ${loading && "opacity-70 cursor-not-allowed"}`}
        >
          {loading ? "Saving..." : "Next"} <MdNavigateNext />
        </button>
      </div>

      {showQuestionModal && (
        <QuestionModal
          onClose={closeQuestionModal}
          onSave={handleSaveQuestion}
          initialData={editQuestionIndex !== null ? questions[editQuestionIndex] : null}
        />
      )}
    </form>
  );
}