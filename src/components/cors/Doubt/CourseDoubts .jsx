import { useState, useEffect } from 'react';
import { getDoubtsByCourse } from '../../../services/operations/doubtService';
import DoubtList from './DoubtList';

const CourseDoubts = ({ courseId }) => {
  const [doubts, setDoubts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDoubts();
  }, [courseId]);

  const fetchDoubts = async () => {
    setLoading(true);
    try {
      const response = await getDoubtsByCourse(courseId);
      console.log("doubts", response.data);
      setDoubts(response.data.doubts);
    } catch (error) {
      console.error("Error fetching doubts:", error);
    }
    setLoading(false);
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold text-richblack-5 mb-4">Course Doubts</h2>
      <DoubtList 
        doubts={doubts} 
        isInstructor={true} 
        onUpdate={fetchDoubts} 
      />
    </div>
  );
};

export default CourseDoubts;