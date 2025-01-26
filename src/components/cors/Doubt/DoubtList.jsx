import { useState } from 'react';
import { FaRegClock, FaChevronUp, FaReply } from 'react-icons/fa';
import { format } from 'date-fns';
import ReplyForm from './ReplyForm';

const DoubtList = ({ doubts, isInstructor, onUpdate }) => {
  const [expandedDoubt, setExpandedDoubt] = useState(null);

  return (
    <div className="w-full max-w-4xl mx-auto mt-8">
      <div className="space-y-4">
        {doubts.map((doubt) => (
          <div 
            key={doubt._id}
            className="bg-richblack-800 rounded-lg p-4 hover:bg-richblack-700 transition-all duration-200"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <img 
                    src={doubt?.student?.image || "https://api.dicebear.com/7.x/initials/svg?seed="+doubt?.student?.firstName}
                    alt={doubt?.student?.firstName}
                    className="w-8 h-8 rounded-full"
                  />
                  <div>
                    <p className="text-sm font-medium text-richblack-5">
                      {doubt?.student?.firstName} {doubt?.student?.lastName}
                    </p>
                    <p className="text-xs text-richblack-300 flex items-center gap-1">
                      <FaRegClock />
                      {format(new Date(doubt.createdAt), 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-richblack-5 mb-2">
                  {doubt.title}
                </h3>
                <p className="text-richblack-100">
                  {doubt.description}
                </p>
              </div>
              
              <div className="flex flex-col items-end gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium
                  ${doubt.status === 'resolved' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {doubt.status}
                </span>
                
                <button 
                  onClick={() => onUpdate(doubt._id)}
                  className="flex items-center gap-1 text-sm text-richblack-300 hover:text-yellow-50"
                >
                  <FaChevronUp />
                  {doubt.upvotes.length}
                </button>
              </div>
            </div>

            {isInstructor && doubt.status !== 'resolved' && (
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => setExpandedDoubt(doubt._id)}
                  className="flex items-center gap-2 px-4 py-2 bg-yellow-50 text-richblack-900 rounded-md hover:bg-yellow-100 transition-all duration-200"
                >
                  <FaReply />
                  Reply
                </button>
              </div>
            )}

            {expandedDoubt === doubt._id && (
              <ReplyForm 
                doubtId={doubt._id}
                onReply={onUpdate}
                onClose={() => setExpandedDoubt(null)}
              />
            )}

            {doubt.replies.length > 0 && (
              <div className="mt-4 pt-4 border-t border-richblack-700">
                <div className="space-y-3">
                  {doubt.replies.map((reply) => (
                    <div 
                      key={reply._id}
                      className="flex gap-3 p-2 rounded-md bg-richblack-900"
                    >
                      <img 
                        src={reply.author.image || "https://api.dicebear.com/7.x/initials/svg?seed="+reply.author.firstName}
                        alt={reply.author.firstName}
                        className="w-6 h-6 rounded-full"
                      />
                      <div>
                        <p className="text-sm font-medium text-richblack-5">
                          {reply.author.firstName} {reply.author.lastName}
                          {reply.isInstructorReply && (
                            <span className="ml-2 text-xs text-yellow-50">Instructor</span>
                          )}
                        </p>
                        <p className="text-sm text-richblack-100">{reply.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoubtList;