import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { fetchInstructorCourses } from '../../../services/operations/courseDetailsAPI';
import CourseDoubts from './CourseDoubts ';

const InstructorCourses = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const { token } = useSelector(state => state.auth);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await fetchInstructorCourses(token);
      console.log("Instructor Courses:", response)

      setCourses(response);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };
if(courses.length === 0){
  return (
    <div className="min-h-screen bg-richblack-900 p-4">
      <h1 className="text-3xl font-semibold text-richblack-5 mb-6">My Courses</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <h1 className='text-richblack-5'>No Courses Available</h1>
      </div>
    </div>
  );
}
  return (
    <div className="min-h-screen bg-richblack-900 p-4">
      <h1 className="text-3xl font-semibold text-richblack-5 mb-6">My Courses</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map(course => (
          <div 
            key={course._id}
            className="bg-richblack-800 p-4 rounded-lg cursor-pointer hover:bg-richblack-700 transition-all duration-200"
            onClick={() => setSelectedCourse(course)}
          >
            <div className="flex items-center gap-4">
              <img 
                src={course.thumbnail || "https://via.placeholder.com/50"}
                alt={course.courseName}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <h2 className="text-lg font-semibold text-richblack-5">{course.courseName}</h2>
              
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedCourse && (
        <CourseDoubts courseId={selectedCourse._id} />
      )}
    </div>
  );
};

export default InstructorCourses;