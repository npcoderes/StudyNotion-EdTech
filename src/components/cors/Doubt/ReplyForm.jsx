import { useState } from 'react';
import { useSelector } from 'react-redux';
import { FiSend, FiX } from 'react-icons/fi';
import { addReply } from '../../../services/operations/doubtService';
import toast from 'react-hot-toast';

const ReplyForm = ({ doubtId, onReply, onClose }) => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const { token } = useSelector(state => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim()) {
      toast.error("Reply cannot be empty");
      return;
    }
    
    setLoading(true);
    try {
      const response = await addReply(doubtId, { content, token });
      if (response.data.success) {
        toast.success("Reply submitted successfully");
        setContent('');
        onReply();
        onClose();
      } else {
        toast.error(response.message || "Failed to submit reply");
      }
    } catch (error) {
      console.error("Error adding reply:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-2">
      <div className="border-b border-[#E5E7EB] pb-3 mb-3">
        <h4 className="text-sm font-medium text-[#111827]">Your Response</h4>
        <p className="text-xs text-[#6B7280]">
          Provide a clear and helpful answer to the student's question
        </p>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your reply here... Be specific and include examples if applicable."
            className="w-full px-4 py-3 text-[#111827] bg-white border border-[#D1D5DB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#422FAF] focus:border-[#422FAF] transition-colors resize-none h-32"
            required
          />
          <div className="mt-1 flex justify-between">
            <p className="text-xs text-[#6B7280]">
              {content.length > 0 ? `${content.length} characters` : "Detailed answers are more helpful"}
            </p>
            <p className="text-xs text-[#6B7280]">
              Markdown formatting supported
            </p>
          </div>
        </div>
        
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1 px-4 py-2 border border-[#E5E7EB] text-[#4B5563] rounded-md hover:bg-[#F9FAFB] transition-colors text-sm font-medium"
          >
            <FiX className="text-[#6B7280]" />
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-1 px-5 py-2 bg-[#422FAF] text-white rounded-md hover:bg-[#3B27A1] transition-colors text-sm font-medium disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </span>
            ) : (
              <>
                <FiSend />
                Submit Reply
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReplyForm;