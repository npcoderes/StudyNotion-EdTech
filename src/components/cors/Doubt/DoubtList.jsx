import { useState } from 'react';
import { FiClock, FiChevronUp, FiMessageSquare, FiCheck } from 'react-icons/fi';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import ReplyForm from './ReplyForm';
import { upvoteDoubt } from '../../../services/operations/doubtService';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';

const DoubtList = ({ doubts, isInstructor, onUpdate }) => {
  const [expandedDoubt, setExpandedDoubt] = useState(null);
  const {token} = useSelector((state) => state.auth);
  console.log("token",token); 

  if (!doubts || doubts.length === 0) {
    return (
      <div className="py-8 text-center">
        <h3 className="text-[#4B5563] font-medium">No doubts available</h3>
      </div>
    );
  }

  return (
    <motion.div 
      className="w-full space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {doubts.map((doubt) => (
        <motion.div 
          key={doubt._id}
          className="bg-white rounded-lg border border-[#E5E7EB] shadow-sm hover:shadow-md transition-all duration-200"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="p-5">
            {/* Doubt Header */}
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1">
                {/* Student Info */}
                <div className="flex items-center gap-3 mb-3">
                  <img 
                    src={doubt?.student?.image || `https://api.dicebear.com/7.x/initials/svg?seed=${doubt?.student?.firstName}&backgroundColor=4F46E5`}
                    alt={doubt?.student?.firstName}
                    className="w-9 h-9 rounded-full border border-[#E5E7EB]"
                  />
                  <div>
                    <p className="text-sm font-medium text-[#111827]">
                      {doubt?.student?.firstName} {doubt?.student?.lastName}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-[#6B7280]">
                      <FiClock className="text-[#9CA3AF]" />
                      {format(new Date(doubt.createdAt), 'MMM d, yyyy')}
                      
                      {/* {doubt.status && (
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          doubt.status === 'resolved' 
                            ? 'bg-[#DCFCE7] text-[#15803D]' 
                            : 'bg-[#FEF3C7] text-[#B45309]'
                        }`}>
                          {doubt.status === 'resolved' && <FiCheck className="mr-1" />}
                          {doubt.status}
                        </span>
                      )} */}
                    </div>
                  </div>
                </div>
                
                {/* Doubt Content */}
                <h3 className="text-lg font-medium text-[#111827] mb-2">
                  {doubt.title}
                </h3>
                <p className="text-[#4B5563] text-sm">
                  {doubt.description}
                </p>
              </div>
              
              <div className="flex flex-col items-end gap-2">
                <button 
                  onClick={() => {
                    if(token){
                      upvoteDoubt(doubt._id, token)
                        .then(onUpdate)
                        .then(()=> toast.success("Upvoted "))
                        .catch(console.error);
                    }
                  }
                    
                  }
                  className="flex items-center gap-1 px-2 py-1 text-xs bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#4B5563] rounded-md transition-colors"
                >
                  <FiChevronUp className="text-[#422FAF]" />
                  {doubt.upvotes?.length || 0}
                </button>
              </div>
            </div>

            {/* Reply Button */}
            { doubt.status !== 'resolved' && (
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => setExpandedDoubt(expandedDoubt === doubt._id ? null : doubt._id)}
                  className="flex items-center gap-2 px-4 py-2 bg-[#EEF2FF] text-[#422FAF] rounded-md hover:bg-[#E0E7FF] transition-colors text-sm font-medium"
                >
                  <FiMessageSquare />
                  Reply
                </button>
              </div>
            )}
          </div>

          {/* Reply Form */}
          <AnimatePresence>
            {expandedDoubt === doubt._id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="px-5 pb-4">
                  <ReplyForm 
                    doubtId={doubt._id}
                    onReply={onUpdate}
                    onClose={() => setExpandedDoubt(null)}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Replies */}
          {doubt.replies && doubt.replies.length > 0 && (
            <div className="border-t border-[#E5E7EB] px-5 pt-3 pb-4 bg-[#F9FAFB]">
              <p className="text-xs font-medium text-[#6B7280] mb-3">
                {doubt.replies.length} {doubt.replies.length === 1 ? 'Reply' : 'Replies'}
              </p>
              
              <div className="space-y-3">
                {doubt.replies.map((reply) => (
                  <div 
                    key={reply._id}
                    className="flex gap-3 p-3 rounded-md bg-white border border-[#E5E7EB]"
                  >
                    <img 
                      src={reply.author?.image || `https://api.dicebear.com/7.x/initials/svg?seed=${reply.author?.firstName}&backgroundColor=4F46E5`}
                      alt={reply.author?.firstName}
                      className="w-8 h-8 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center">
                          <p className="text-sm font-medium text-[#111827]">
                            {reply.author?.firstName} {reply.author?.lastName}
                          </p>
                          {reply.isInstructorReply && (
                            <span className="ml-2 px-2 py-0.5 bg-[#EEF2FF] text-[#422FAF] text-xs rounded-full">
                              Instructor
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#9CA3AF]">
                          {format(new Date(reply.createdAt || Date.now()), 'MMM d, yyyy')}
                        </p>
                      </div>
                      <p className="text-sm text-[#4B5563]">{reply.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      ))}
    </motion.div>
  );
};

export default DoubtList;