import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { createSubSection, updateSubSection } from "../../../../../services/operations/courseDetailsAPI";
import { setCourse } from "../../../../../slices/courseSlice";
import toast from "react-hot-toast";
import { RxCross2 } from "react-icons/rx";
import Upload from "../Upload";
import { FiFileText, FiTrash2 } from "react-icons/fi";

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
  const [pdfFile, setPdfFile] = useState(null);
  const [removePdf, setRemovePdf] = useState(false);
  const { course } = useSelector((state) => state.course);
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (view || edit) {
      setValue("lectureTitle", modalData.title);
      setValue("lectureDesc", modalData.description);
      setValue("lectureVideo", modalData.videoUrl);
      setValue("lecturePdf", modalData.otherUrl || "");
    }
  }, [view, edit, modalData, setValue]);

  const formUpdated = () => {
    const currentValue = getValues();
    return (
      currentValue.lectureTitle !== modalData?.title ||
      currentValue.lectureDesc !== modalData?.description ||
      currentValue.lectureVideo !== modalData?.videoUrl ||
      pdfFile !== null ||
      removePdf
    );
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        toast.error('Please upload a PDF file');
        return;
      }
      setPdfFile(file);
    }
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
      formData.append("videoFile", currentValues.lectureVideo);
    }
    
    // Add PDF if selected
    if (pdfFile) {
      formData.append("pdfMaterial", pdfFile);
    }
    
    // Handle PDF removal
    if (removePdf) {
      formData.append("removePdf", "true");
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
    
    // Add PDF if selected
    if (pdfFile) {
      formData.append("pdfMaterial", pdfFile);
    }
    
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
          
          {/* PDF Material Upload */}
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-[#4B5563]" htmlFor="lecturePdf">
              PDF Study Material <span className="text-xs text-[#6B7280]">(Optional)</span>
            </label>
            
            {view && modalData.otherUrl ? (
              <div className="flex items-center gap-3 p-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg">
                <FiFileText className="text-[#422FAF] text-xl" />
                <div className="flex-grow">
                  <p className="text-sm font-medium text-[#111827]">Study Material</p>
                </div>
                <a 
                  href={modalData.otherUrl} 
                  target="_blank" 
                  rel="noreferrer"
                  className="px-3 py-1 text-sm text-[#422FAF] bg-white border border-[#422FAF] rounded-md hover:bg-[#EEF2FF] transition-colors"
                >
                  View PDF
                </a>
              </div>
            ) : edit && modalData.otherUrl && !removePdf ? (
              <div className="flex items-center justify-between p-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg">
                <div className="flex items-center gap-3">
                  <FiFileText className="text-[#422FAF] text-xl" />
                  <div>
                    <p className="text-sm font-medium text-[#111827]">Study Material</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <a 
                    href={modalData.otherUrl} 
                    target="_blank" 
                    rel="noreferrer"
                    className="px-3 py-1 text-sm text-[#422FAF] bg-white border border-[#422FAF] rounded-md hover:bg-[#EEF2FF] transition-colors"
                  >
                    View
                  </a>
                  <button 
                    type="button" 
                    onClick={() => setRemovePdf(true)}
                    className="px-3 py-1 text-sm text-[#EF4444] bg-white border border-[#EF4444] rounded-md hover:bg-[#FEE2E2] transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="relative border border-dashed border-[#D1D5DB] p-4 rounded-lg bg-[#F9FAFB] hover:bg-[#F3F4F6] transition-colors">
                  <input
                    type="file"
                    id="lecturePdf"
                    accept="application/pdf"
                    disabled={view || loading}
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center justify-center text-center py-4">
                    <FiFileText className="text-3xl text-[#422FAF] mb-3" />
                    <p className="text-sm font-medium text-[#111827] mb-1">
                      {pdfFile ? pdfFile.name : "Upload PDF material"}
                    </p>
                    <p className="text-xs text-[#6B7280]">
                      Drag and drop or click to browse
                    </p>
                  </div>
                </div>
                {pdfFile && (
                  <div className="flex items-center justify-between p-2 bg-[#EEF2FF] rounded-lg">
                    <span className="text-xs text-[#422FAF] truncate max-w-[80%]">{pdfFile.name}</span>
                    <button 
                      type="button" 
                      onClick={() => setPdfFile(null)}
                      className="p-1 text-[#6B7280] hover:text-[#EF4444]"
                      aria-label="Remove PDF"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                )}
              </>
            )}
            
            {/* Show this when user chooses to remove PDF in edit mode */}
            {edit && removePdf && (
              <div className="flex items-center justify-between p-2 bg-[#FEF2F2] rounded-lg">
                <span className="text-xs text-[#B91C1C]">PDF will be removed</span>
                <button 
                  type="button" 
                  onClick={() => setRemovePdf(false)}
                  className="text-xs underline text-[#4B5563] hover:text-[#111827]"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
          
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