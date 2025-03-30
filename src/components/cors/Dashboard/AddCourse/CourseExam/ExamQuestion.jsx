import React from 'react'
import { FaEdit, FaTrash, FaArrowUp, FaArrowDown } from 'react-icons/fa'

export default function ExamQuestion({ 
  question, 
  index, 
  onEdit, 
  onRemove, 
  onReorder,
  totalQuestions 
}) {
  const questionTypeLabels = {
    mcq: "Multiple Choice",
    truefalse: "True/False",
    shortAnswer: "Short Answer"
  }

  return (
    <div className="bg-white rounded-lg p-5 border border-[#E2E8F0] transition-all hover:border-[#CBD5E1] shadow-sm mb-4">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-[#3B82F6] text-xs font-medium px-2.5 py-1 rounded-full text-white">
              Q{index + 1}
            </span>
            <span className="bg-[#F1F5F9] text-xs px-2.5 py-1 rounded-full text-[#475569] font-medium">
              {questionTypeLabels[question.type]} • {question.points} {question.points > 1 ? 'points' : 'point'}
            </span>
          </div>
          <p className="text-[#1E293B] font-medium mb-2">
            {question.question}
          </p>
          
          {question.type === 'mcq' && (
            <div className="mt-3 space-y-2">
              {question.options && question.options.map((option, i) => (
                <div key={i} className="flex items-center gap-2.5 text-sm">
                  <span className="w-4 h-4 rounded-full border border-[#94A3B8] flex-shrink-0 flex items-center justify-center">
                    {option.isCorrect && (
                      <span className="w-2 h-2 bg-[#10B981] rounded-full"></span>
                    )}
                  </span>
                  <span className={option.isCorrect ? "text-[#1E293B] font-medium" : "text-[#64748B]"}>
                    {option.text}
                  </span>
                </div>
              ))}
            </div>
          )}
          
          {question.type === 'truefalse' && (
            <div className="mt-3 flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2.5">
                <span className="w-4 h-4 rounded-full border border-[#94A3B8] flex-shrink-0 flex items-center justify-center">
                  {question.options && question.options[0]?.isCorrect && (
                    <span className="w-2 h-2 bg-[#10B981] rounded-full"></span>
                  )}
                </span>
                <span className={question.options && question.options[0]?.isCorrect ? "text-[#1E293B] font-medium" : "text-[#64748B]"}>
                  True
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-4 h-4 rounded-full border border-[#94A3B8] flex-shrink-0 flex items-center justify-center">
                  {question.options && question.options[1]?.isCorrect && (
                    <span className="w-2 h-2 bg-[#10B981] rounded-full"></span>
                  )}
                </span>
                <span className={question.options && question.options[1]?.isCorrect ? "text-[#1E293B] font-medium" : "text-[#64748B]"}>
                  False
                </span>
              </div>
            </div>
          )}
          
          {question.type === 'shortAnswer' && (
            <div className="mt-3 text-sm text-[#64748B]">
              <span>Accepted answers: </span>
              {question.answers && question.answers.map((answer, i) => (
                <span key={i} className="bg-[#F1F5F9] text-[#334155] px-2 py-0.5 rounded text-xs mx-1">
                  {answer}
                </span>
              ))}
            </div>
          )}

          {question.explanation && (
            <div className="mt-3 text-sm text-[#334155] bg-[#EFF6FF] p-3 rounded-md border border-[#DBEAFE]">
              <span className="font-medium">Explanation:</span> {question.explanation}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2 ml-4">
          <button
            onClick={onEdit}
            type="button"
            className="p-2 text-[#475569] hover:text-[#3B82F6] bg-[#F1F5F9] hover:bg-[#EFF6FF] rounded transition-all"
            title="Edit question"
          >
            <FaEdit />
          </button>
          <button
            onClick={onRemove}
            type="button"
            className="p-2 text-[#475569] hover:text-[#EF4444] bg-[#F1F5F9] hover:bg-[#FEF2F2] rounded transition-all"
            title="Remove question"
          >
            <FaTrash />
          </button>
          <button
            onClick={() => onReorder(index, "up")}
            disabled={index === 0}
            type="button"
            title="Move up"
            className={`p-2 rounded transition-all ${
              index === 0 ? "text-[#CBD5E1] bg-[#F8FAFC] cursor-not-allowed" : "text-[#475569] hover:text-[#3B82F6] bg-[#F1F5F9] hover:bg-[#EFF6FF]"
            }`}
          >
            <FaArrowUp />
          </button>
          <button
            onClick={() => onReorder(index, "down")}
            disabled={index === totalQuestions - 1}
            type="button"
            title="Move down"
            className={`p-2 rounded transition-all ${
              index === totalQuestions - 1 ? "text-[#CBD5E1] bg-[#F8FAFC] cursor-not-allowed" : "text-[#475569] hover:text-[#3B82F6] bg-[#F1F5F9] hover:bg-[#EFF6FF]"
            }`}
          >
            <FaArrowDown />
          </button>
        </div>
      </div>
    </div>
  )
}