import { useState } from 'react';
import { useSelector } from 'react-redux';
import { addReply } from '../../../services/operations/doubtService';

const ReplyForm = ({ doubtId, onReply, onClose }) => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const { token } = useSelector(state => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addReply(doubtId, { content,token });
      setContent('');
      onReply();
      onClose();
    } catch (error) {
      console.error("Error adding reply:", error);
    }
    setLoading(false);
  };

  return (
    <div className="mt-4">
      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your reply..."
          className="w-full bg-richblack-700 text-richblack-5 p-3 rounded-md mb-4 h-32"
          required
        />
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={onClose}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-all duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-yellow-50 text-richblack-900 px-6 py-2 rounded-md hover:bg-yellow-100 transition-all duration-200"
          >
            {loading ? 'Submitting...' : 'Submit Reply'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReplyForm;