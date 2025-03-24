import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiAlertCircle, FiRefreshCw } from 'react-icons/fi';
import { getDoubtsByCourse } from '../../../services/operations/doubtService';
import DoubtList from './DoubtList';

const CourseDoubts = ({ courseId, name }) => {
  const [doubts, setDoubts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (courseId) {
      fetchDoubts();
    }
  }, [courseId]);

  const fetchDoubts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getDoubtsByCourse(courseId);
      console.log(response);
      if (response.data.success) {
        setDoubts(response.data.doubts || []);
      } else {
        console.error("Failed to load doubts:", response.message);
        setError(response.message || "Failed to load doubts");
      }
    } catch (error) {
      setError("An error occurred while fetching doubts");
      console.error("Error fetching doubts:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Header with refresh button */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-[#111827]">
          {name ? `${name} - Doubts` : 'Course Doubts'}
        </h2>
        <button 
          onClick={fetchDoubts}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-md border border-[#E5E7EB] hover:bg-[#F9FAFB] transition-colors"
          aria-label="Refresh doubts"
        >
          <FiRefreshCw className={`${loading ? 'animate-spin' : ''} text-[#422FAF]`} />
          <span className="text-[#4B5563]">Refresh</span>
        </button>
      </div>

      {/* Loading state */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex justify-center items-center py-12"
          >
            <div className="flex flex-col items-center">
              <div className="animate-spin h-10 w-10 border-4 border-[#422FAF] border-t-transparent rounded-full mb-3"></div>
              <p className="text-[#6B7280]">Loading doubts...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error state */}
      {!loading && error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#FEF2F2] border border-[#FECACA] rounded-lg p-4 mb-6"
        >
          <div className="flex items-start">
            <FiAlertCircle className="text-[#EF4444] mt-0.5 mr-2 flex-shrink-0" />
            <div>
              <h3 className="text-[#B91C1C] font-medium">Error loading doubts</h3>
              <p className="text-[#991B1B] text-sm mt-1">{error}</p>
              <button 
                onClick={fetchDoubts}
                className="mt-2 text-sm font-medium text-[#422FAF] hover:text-[#3B27A1]"
              >
                Try again
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Empty state */}
      {!loading && !error && doubts.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-8 text-center"
        >
          <div className="inline-flex items-center justify-center w-12 h-12 bg-[#EEF2FF] rounded-full mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#422FAF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-[#111827] mb-1">No doubts found</h3>
          <p className="text-[#6B7280] text-sm mb-4">
            There are no doubts for this course yet. Students will ask questions as they progress through the course.
          </p>
        </motion.div>
      )}

      {/* Doubts list */}
      {!loading && !error && doubts.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="mb-4 flex justify-between items-center">
            <div className="text-[#6B7280] text-sm">
              Showing {doubts.length} doubt{doubts.length !== 1 ? 's' : ''}
            </div>
            <div className="text-[#6B7280] text-sm">
              Newest first
            </div>
          </div>
          
          <DoubtList 
            doubts={doubts} 
            isInstructor={true} 
            onUpdate={fetchDoubts} 
          />
        </motion.div>
      )}
    </div>
  );
};

export default CourseDoubts;