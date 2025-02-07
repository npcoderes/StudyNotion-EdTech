import { useState } from 'react';
import { useSelector } from 'react-redux';
import { createDoubt } from '../../../services/operations/doubtService';

const CreateDoubt = ({ courseId, onDoubtCreated, onClose }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const { token } = useSelector(state => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createDoubt({ courseId, title, description,token });
      setTitle('');
      setDescription('');
      onDoubtCreated();
      onClose();
    } catch (error) {
      console.error("Error creating doubt:", error);
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-richblack-800 p-6 rounded-lg w-11/12 max-w-lg">
        <h3 className="text-xl font-semibold text-richblack-5 mb-4">Ask a Question</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Question Title"
            className="w-full bg-richblack-700 text-richblack-5 p-3 rounded-md mb-4"
            required
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your question..."
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
              {loading ? 'Submitting...' : 'Submit Question'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateDoubt;