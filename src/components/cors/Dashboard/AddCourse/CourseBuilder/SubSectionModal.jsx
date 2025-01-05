import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { createSubSection, updateSubSection } from "../../../../../services/operations/courseDetailsAPI";
import { setCourse } from "../../../../../slices/courseSlice";
import toast from "react-hot-toast";
import { RxCross2 } from "react-icons/rx";
import Upload from "../Upload"
import IconBtn from "../../../../common/IconBtn";
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
  const [loading, setLoading] = useState(null);
  const { course } = useSelector((state) => state.course);
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (view || edit) {
      // console.log("modalData", modalData)
      setValue("lectureTitle", modalData.title);
      setValue("lectureDesc", modalData.description);
      setValue("lectureVideo", modalData.videoUrl);
    }
  });
  const formUpdated = () => {
    const currentValue = getValues();
    if (
      currentValue.lectureTitle !== modalData?.title ||
      currentValue.lectureDesc !== modalData?.description ||
      currentValue.lectureVideo !== modalData?.videoUrl
    ) {
      return true;
    } else {
      return false;
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

  const onSubmit = async(data)=>{
    if (view) return 
    if(edit)
    {
        if(!formUpdated)
        {
            toast.error("No changes made to the form data")
        }else{
            handleEditSection()
        }
        return
    }
    const formData= new FormData()
    formData.append("sectionId", modalData)
    console.log("Section id         ",modalData.sectionId)
    console.log("Section id MODAL         ",modalData)

    formData.append("title", data.lectureTitle)
    formData.append("description", data.lectureDesc)
    formData.append("video", data.lectureVideo)
    setLoading(true)
    const result =  await createSubSection(formData, token)
    if (result) {
        // update the structure of course
        const updatedCourseContent = course.courseContent.map((section) =>
          section._id === modalData ? result : section
        )
        const updatedCourse = { ...course, courseContent: updatedCourseContent }
        dispatch(setCourse(updatedCourse))
      }
      setModalData(null)
      setLoading(false)

  }
  return(
    <div className=" fixed w-screen h-screen inset-0 z-[10000] !mt-0 grid place-items-center backdrop-blur-sm overflow-auto bg-white bg-opacity-10">
        <div className="my-10 w-11/12 max-w-[700px] rounded-lg border border-richblack-400 bg-richblack-800">
            {/* modal heder  */}
            <div className="flex justify-between items-center rounded-t-lg bg-richblack-700 p-5">
                <p className="text-xl font-semibold text-richblack-5">
                    {view? "View Lecture" : edit? "Edit Lecture" : "Add Lecture"}
                </p>
                <button onClick={()=> (!loading ? setModalData(null) : {})}>
                    <RxCross2  className="text-2xl text-richblack-5"/>
                </button>
            </div>
            {/* modal form  */}
            <form action="" onSubmit={handleSubmit(onSubmit)}  className="space-y-8 px-8 py-10">
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
            <label className="text-sm text-richblack-5" htmlFor="lectureTitle">
              Lecture Title {!view && <sup className="text-pink-200">*</sup>}
            </label>
            <input
              disabled={view || loading}
              id="lectureTitle"
              placeholder="Enter Lecture Title"
              {...register("lectureTitle", { required: true })}
              className="form-style w-full"
            />
            {errors.lectureTitle && (
              <span className="ml-2 text-xs tracking-wide text-pink-200">
                Lecture title is required
              </span>
            )}
          </div>
          
          {/* Lecture Description */}
          <div className="flex flex-col space-y-2">
            <label className="text-sm text-richblack-5" htmlFor="lectureDesc">
              Lecture Description{" "}
              {!view && <sup className="text-pink-200">*</sup>}
            </label>
            <textarea
              disabled={view || loading}
              id="lectureDesc"
              placeholder="Enter Lecture Description"
              {...register("lectureDesc", { required: true })}
              className="form-style resize-x-none min-h-[130px] w-full"
            />
            {errors.lectureDesc && (
              <span className="ml-2 text-xs tracking-wide text-pink-200">
                Lecture Description is required
              </span>
            )}
          </div>
          {!view && (
            <div className="flex justify-end">
              <IconBtn
                disabled={loading}
                text={loading ? "Loading.." : edit ? "Save Changes" : "Save"}
              />
            </div>
          )}
            </form>
        </div>
    </div>
  )
};

export default SubSectionModal;
