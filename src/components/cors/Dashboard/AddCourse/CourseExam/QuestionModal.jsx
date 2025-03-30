import React, { useState, useEffect } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { MdClose } from 'react-icons/md'
import { FaPlus, FaTrash } from 'react-icons/fa'
import ModalWrapper from '../../../../common/ModalWrapper'

export default function QuestionModal({ onClose, onSave, initialData = null }) {
  const { register, handleSubmit, control, watch, setValue, formState: { errors } } = useForm({
    defaultValues: initialData || {
      question: '',
      type: 'mcq',
      options: [
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false }
      ],
      answers: [''],
      points: 1,
      explanation: ''
    }
  });
  
  const questionType = watch('type');
  const options = watch('options');
  
  const { fields: optionFields, append: appendOption, remove: removeOption } = useFieldArray({
    control,
    name: "options"
  });
  
  const { fields: answerFields, append: appendAnswer, remove: removeAnswer } = useFieldArray({
    control,
    name: "answers"
  });
  
  // Effect to handle true/false question type
  useEffect(() => {
    if (questionType === 'truefalse') {
      // Set options to just True and False
      setValue('options', [
        { text: 'True', isCorrect: watch('options')?.[0]?.isCorrect || false },
        { text: 'False', isCorrect: watch('options')?.[1]?.isCorrect || false }
      ]);
    }
  }, [questionType, setValue, watch]);

  // Handle checkbox change for MCQ more explicitly
  const handleMCQOptionChange = (index, checked) => {
    console.log("MCQ option changed:", index, checked);
    const updatedOptions = [...options];
    updatedOptions[index] = {
      ...updatedOptions[index],
      isCorrect: checked
    };
    setValue('options', updatedOptions);
  };

  // Handle radio selection for true/false
  const handleTrueFalseChange = (isTrue) => {
    console.log("True/False changed:", isTrue);
    setValue('options', [
      { text: 'True', isCorrect: isTrue },
      { text: 'False', isCorrect: !isTrue }
    ]);
  };

  const validateAndSave = () => {
    // Get current form values
    const data = {
      question: watch('question'),
      type: watch('type'),
      options: watch('options'),
      answers: watch('answers'),
      points: parseInt(watch('points')),
      explanation: watch('explanation')
    };
    
    // Validate fields
    if (!data.question) {
      alert("Question text is required");
      return;
    }
    
    // Additional validation for MCQ options
    if (data.type === 'mcq') {
      // Filter out empty options
      data.options = data.options.filter(option => option && option.text && option.text.trim() !== '');
      
      // Ensure we have at least 2 options
      if (data.options.length < 2) {
        alert("Multiple choice questions must have at least 2 options");
        return;
      }
      
      // Validate that at least one option is selected as correct
      if (!data.options.some(option => option.isCorrect)) {
        alert("Please select at least one correct answer");
        return;
      }
    }
    
    // For true/false questions
    if (data.type === 'truefalse') {
      // Make sure options have text for true/false
      data.options = [
        { text: 'True', isCorrect: !!data.options[0]?.isCorrect },
        { text: 'False', isCorrect: !!data.options[1]?.isCorrect }
      ];
      
      // Make sure one option is selected
      if (!data.options[0].isCorrect && !data.options[1].isCorrect) {
        alert("Please select either True or False as the correct answer");
        return;
      }
    }
    
    // For short answer questions, make sure there's at least one answer
    if (data.type === 'shortAnswer') {
      // Filter out empty answers
      data.answers = data.answers.filter(answer => answer && answer.trim() !== '');
      
      if (!data.answers.length) {
        alert("Please provide at least one acceptable answer");
        return;
      }
    }
    
    console.log("Saving question data:", data);
    onSave(data);
  };

  return (
    <ModalWrapper>
      <div className="fixed inset-0 bg-[#1E293B]/70 flex items-center justify-center z-[1000000] p-4" onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClose();
      }}>
        <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-lg" onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}>
          <div className="sticky top-0 bg-white p-4 border-b border-[#E2E8F0] flex justify-between items-center z-10">
            <h3 className="text-lg font-semibold text-[#1E293B]">
              {initialData ? 'Edit Question' : 'Add New Question'}
            </h3>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onClose();
              }}
              className="p-1 bg-[#F1F5F9] hover:bg-[#E2E8F0] rounded-full transition-colors"
            >
              <MdClose className="text-[#64748B]" />
            </button>
          </div>
          
          <div className="p-6 space-y-6">
            {/* Question Text */}
            <div>
              <label className="text-sm font-medium text-[#334155] mb-1 block">
                Question <span className="text-[#EF4444]">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter your question"
                {...register("question", { required: "Question text is required" })}
                className="w-full bg-white text-[#334155] rounded-lg p-3 border border-[#CBD5E1] focus:ring-2 focus:ring-[#3B82F6] focus:border-[#3B82F6] outline-none transition"
              />
              {errors.question && (
                <span className="text-[#EF4444] text-xs mt-1 block">{errors.question.message}</span>
              )}
            </div>
            
            {/* Question Type Selector */}
            <div>
              <label className="text-sm font-medium text-[#334155] mb-1 block">
                Question Type <span className="text-[#EF4444]">*</span>
              </label>
              <select
                {...register("type")}
                className="w-full bg-white text-[#334155] rounded-lg p-3 border border-[#CBD5E1] focus:ring-2 focus:ring-[#3B82F6] focus:border-[#3B82F6] outline-none transition"
              >
                <option value="mcq">Multiple Choice</option>
                <option value="truefalse">True/False</option>
                <option value="shortAnswer">Short Answer</option>
              </select>
            </div>
            
            {/* Points */}
            <div>
              <label className="text-sm font-medium text-[#334155] mb-1 block">
                Points <span className="text-[#EF4444]">*</span>
              </label>
              <input
                type="number"
                min="1"
                {...register("points", { 
                  required: "Points value is required",
                  min: { value: 1, message: "Points must be at least 1" }
                })}
                className="w-full bg-white text-[#334155] rounded-lg p-3 border border-[#CBD5E1] focus:ring-2 focus:ring-[#3B82F6] focus:border-[#3B82F6] outline-none transition"
              />
              {errors.points && (
                <span className="text-[#EF4444] text-xs mt-1 block">{errors.points.message}</span>
              )}
            </div>
            
            {/* Multiple Choice Options */}
            {(questionType === 'mcq') && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-[#334155]">
                    Options <span className="text-[#EF4444]">*</span>
                  </label>
                  {optionFields.length < 8 && (
                    <button
                      type="button"
                      onClick={() => appendOption({ text: '', isCorrect: false })}
                      className="text-[#3B82F6] hover:text-[#2563EB] text-xs flex items-center gap-1 transition-colors"
                    >
                      <FaPlus className="text-[10px]" /> Add Option
                    </button>
                  )}
                </div>
                
                <div className="space-y-3">
                  {optionFields.map((field, index) => (
                    <div key={field.id} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`option-correct-${index}`}
                        checked={options[index]?.isCorrect || false}
                        onChange={(e) => handleMCQOptionChange(index, e.target.checked)}
                        className="w-4 h-4 rounded text-[#3B82F6] border-[#94A3B8] focus:ring-[#3B82F6]"
                      />
                      <input
                        type="text"
                        placeholder={`Option ${index + 1}`}
                        {...register(`options.${index}.text`, {
                          required: "Option text is required"
                        })}
                        className="flex-1 bg-white text-[#334155] rounded-lg p-2 border border-[#CBD5E1] focus:ring-2 focus:ring-[#3B82F6] focus:border-[#3B82F6] outline-none transition"
                      />
                      {optionFields.length > 2 && (
                        <button
                          type="button"
                          onClick={() => removeOption(index)}
                          className="p-2 text-[#EF4444] hover:bg-[#FEF2F2] rounded transition-colors"
                        >
                          <FaTrash className="text-xs" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                
                {options && !options.some(option => option?.isCorrect) && (
                  <p className="text-[#F59E0B] text-xs mt-2">
                    Please select at least one correct answer option
                  </p>
                )}
              </div>
            )}
            
            {/* True/False Options */}
            {(questionType === 'truefalse') && (
              <div>
                <label className="text-sm font-medium text-[#334155] mb-2 block">
                  Select Correct Answer <span className="text-[#EF4444]">*</span>
                </label>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="true-correct"
                        name="truefalse"
                        checked={options[0]?.isCorrect || false}
                        onChange={() => handleTrueFalseChange(true)}
                        className="w-4 h-4 mr-2 text-[#3B82F6] border-[#94A3B8] focus:ring-[#3B82F6]"
                      />
                      <label htmlFor="true-correct" className="text-[#334155]">True</label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="false-correct"
                        name="truefalse"
                        checked={options[1]?.isCorrect || false}
                        onChange={() => handleTrueFalseChange(false)}
                        className="w-4 h-4 mr-2 text-[#3B82F6] border-[#94A3B8] focus:ring-[#3B82F6]"
                      />
                      <label htmlFor="false-correct" className="text-[#334155]">False</label>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Short Answer Acceptable Answers */}
            {(questionType === 'shortAnswer') && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-[#334155]">
                    Acceptable Answers <span className="text-[#EF4444]">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => appendAnswer('')}
                    className="text-[#3B82F6] hover:text-[#2563EB] text-xs flex items-center gap-1 transition-colors"
                  >
                    <FaPlus className="text-[10px]" /> Add Answer
                  </button>
                </div>
                
                <div className="space-y-3">
                  {answerFields.map((field, index) => (
                    <div key={field.id} className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Enter acceptable answer"
                        {...register(`answers.${index}`, {
                          required: "Answer is required"
                        })}
                        className="flex-1 bg-white text-[#334155] rounded-lg p-2 border border-[#CBD5E1] focus:ring-2 focus:ring-[#3B82F6] focus:border-[#3B82F6] outline-none transition"
                      />
                      {answerFields.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeAnswer(index)}
                          className="p-2 text-[#EF4444] hover:bg-[#FEF2F2] rounded transition-colors"
                        >
                          <FaTrash className="text-xs" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Explanation */}
            <div>
              <label className="text-sm font-medium text-[#334155] mb-1 block">
                Explanation (Optional)
              </label>
              <textarea
                placeholder="Explain the correct answer (will be shown after submission)"
                {...register("explanation")}
                className="w-full bg-white text-[#334155] rounded-lg p-3 border border-[#CBD5E1] focus:ring-2 focus:ring-[#3B82F6] focus:border-[#3B82F6] outline-none transition min-h-[80px]"
              />
            </div>
            
            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-[#E2E8F0]">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onClose();
                }}
                className="bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#475569] py-2.5 px-5 rounded-lg transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  validateAndSave();
                }}
                className="bg-[#3B82F6] hover:bg-[#2563EB] text-white py-2.5 px-6 rounded-lg transition-colors font-medium"
              >
                {initialData ? 'Update' : 'Add'} Question
              </button>
            </div>
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
}