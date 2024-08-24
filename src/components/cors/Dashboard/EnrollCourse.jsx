import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { apiConnector } from "../../../services/apiconnector";
import { profileEndpoints } from "../../../services/apis";
import { useEffect } from "react";
import ProgressBar from "@ramonak/react-progress-bar";
import toast from "react-hot-toast";

const EnrollCourse = () => {
  const { token } = useSelector((state) => state.auth);
  const [EnrollCourse, setEnrollCourse] = useState(null);
  const dispatch = useDispatch();
  const fetchenroll = async () => {
    const toastId = toast.loading("Loading...");

    try {
      console.log("Before calling EnrollCourse");
      const response = await apiConnector(
        "GET",
        profileEndpoints.GET_USER_ENROLLED_COURSES_API,
        null,
        {
          Authorisation: `Bearer ${token}`,
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      console.log("After calling EnrollCourse", response.data);
      setEnrollCourse(response.data.data);
    } catch (err) {
      console.log("Something happend when fetching enroll course", err);
    }
    toast.dismiss(toastId);
  };
  useEffect(() => {
    fetchenroll();
  }, []);

  return (
    <div>
      <h1>Enrolled Courses </h1>
      {!EnrollCourse ? (
        <div>Loading...</div>
      ) : !EnrollCourse.length ? (
        <div>You have not enrolled any course</div>
      ) : (
        EnrollCourse.map((course) => (
          <div key={course._id}>
            <div>
              <img src={course.thumbnail} alt="" />
              <div>
                <p>{course.courseName}</p>
                <p>
                  {course.courseDescription.length > 50
                    ? course.courseDescription.substring(0, 50) + "..."
                    : course.courseDescription}
                </p>
              </div>
            </div>
            <div>{course?.totalDuration}</div>
            <div>
              <p>Progress: {course.progressPercentage || 0}%</p>
              <ProgressBar
                completed={course.progressPercentage || 0}
                height="8px"
                isLabelVisible={false}
              />
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default EnrollCourse;
