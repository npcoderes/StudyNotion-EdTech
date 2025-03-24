import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { createSubSection, updateSubSection } from "../../../../../services/operations/courseDetailsAPI";
import { setCourse } from "../../../../../slices/courseSlice";
import toast from "react-hot-toast";
import { RxCross2 } from "react-icons/rx";
import Upload from "../Upload";

const SubSectionModal = ({
  modalData,
  setModalData,
  add = false,
  edit = false,
  view = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
  } = useForm();
  
  const [loading, setLoading] = useState(false);
  const { course } = useSelector((state) => state.course);
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (view || edit) {
      setValue("lectureTitle", modalData.title);
      setValue("lectureDesc", modalData.description);
      setValue("lectureVideo", modalData.videoUrl);
    }
  }, [view, edit, modalData, setValue]);

  const formUpdated = () => {
    const currentValue = getValues();
    return (
      currentValue.lectureTitle !== modalData?.title ||
      currentValue.lectureDesc !== modalData?.description ||
      currentValue.lectureVideo !== modalData?.videoUrl
    );
  };

  const handleEditSection = async () => {
    const currentValues = getValues();
    const formData = new FormData();
    
    formData.append("sectionId", modalData.sectionId);
    formData.append("subSectionId", modalData._id);
    
    if (currentValues.lectureTitle !== modalData.title) {
      formData.append("title", currentValues.lectureTitle);
    }
    if (currentValues.lectureDesc !== modalData.description) {
      formData.append("description", currentValues.lectureDesc);
    }
    if (currentValues.lectureVideo !== modalData.videoUrl) {
      formData.append("video", currentValues.lectureVideo);
    }
    
    setLoading(true);
    const result = await updateSubSection(formData, token);
    
    if (result) {
      // update the structure of course
      const updatedCourseContent = course.courseContent.map((section) =>
        section._id === modalData.sectionId ? result : section
      );
      const updatedCourse = { ...course, courseContent: updatedCourseContent };
      dispatch(setCourse(updatedCourse));
    }
    
    setModalData(null);
    setLoading(false);
  };

  const onSubmit = async (data) => {
    if (view) return;
    
    if (edit) {
      if (!formUpdated()) {
        toast.error("No changes made to the form data");
      } else {
        handleEditSection();
      }
      return;
    }
    
    const formData = new FormData();
    formData.append("sectionId", modalData);
    formData.append("title", data.lectureTitle);
    formData.append("description", data.lectureDesc);
    formData.append("video", data.lectureVideo);
    
    setLoading(true);
    const result = await createSubSection(formData, token);
    
    if (result) {
      // update the structure of course
      const updatedCourseContent = course.courseContent.map((section) =>
        section._id === modalData ? result : section
      );
      const updatedCourse = { ...course, courseContent: updatedCourseContent };
      dispatch(setCourse(updatedCourse));
    }
    
    setModalData(null);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[1000] !mt-0 grid place-items-center overflow-auto bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="my-10 w-11/12 max-w-[700px] rounded-lg border border-[#E5E7EB] bg-white shadow-lg">
        {/* Modal header */}
        <div className="flex justify-between items-center rounded-t-lg bg-[#F9FAFB] p-5 border-b border-[#E5E7EB]">
          <p className="text-xl font-semibold text-[#111827]">
            {view ? "View Lecture" : edit ? "Edit Lecture" : "Add Lecture"}
          </p>
          <button 
            onClick={() => !loading && setModalData(null)}
            className="text-[#6B7280] hover:text-[#111827] transition-colors"
            aria-label="Close modal"
          >
            <RxCross2 className="text-2xl" />
          </button>
        </div>
        
        {/* Modal form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 px-6 py-8">
          <Upload 
            name="lectureVideo"
            label="Lecture Video"
            register={register}
            setValue={setValue}
            errors={errors}
            video={true}
            viewData={view ? modalData.videoUrl : null}
            editData={edit ? modalData.videoUrl : null}
          />
          
          {/* Lecture Title */}
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-[#4B5563]" htmlFor="lectureTitle">
              Lecture Title {!view && <span className="text-[#EF4444]">*</span>}
            </label>
            <input
              disabled={view || loading}
              id="lectureTitle"
              placeholder="Enter Lecture Title"
              {...register("lectureTitle", { required: true })}
              className="w-full px-4 py-2.5 text-[#111827] bg-white border border-[#D1D5DB] rounded-lg focus:ring-2 focus:ring-[#422FAF] focus:border-[#422FAF] focus:outline-none transition-colors"
            />
            {errors.lectureTitle && (
              <span className="text-xs text-[#EF4444]">
                Lecture title is required
              </span>
            )}
          </div>
          
          {/* Lecture Description */}
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-[#4B5563]" htmlFor="lectureDesc">
              Lecture Description {!view && <span className="text-[#EF4444]">*</span>}
            </label>
            <textarea
              disabled={view || loading}
              id="lectureDesc"
              placeholder="Enter Lecture Description"
              {...register("lectureDesc", { required: true })}
              className="w-full min-h-[130px] px-4 py-2.5 text-[#111827] bg-white border border-[#D1D5DB] rounded-lg focus:ring-2 focus:ring-[#422FAF] focus:border-[#422FAF] focus:outline-none transition-colors resize-none"
            />
            {errors.lectureDesc && (
              <span className="text-xs text-[#EF4444]">
                Lecture Description is required
              </span>
            )}
          </div>
          
          {!view && (
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#422FAF] text-white rounded-lg hover:bg-[#3B27A1] focus:outline-none focus:ring-2 focus:ring-[#422FAF] focus:ring-offset-2 transition-colors font-medium disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
                    Loading...
                  </>
                ) : edit ? (
                  "Save Changes"
                ) : (
                  "Save"
                )}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default SubSectionModal;