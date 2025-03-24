import { useState } from "react"
import { AiFillCaretDown } from "react-icons/ai"
import { FaPlus } from "react-icons/fa"
import { MdEdit } from "react-icons/md"
import { RiDeleteBin6Line } from "react-icons/ri"
import { RxDropdownMenu } from "react-icons/rx"
import { useDispatch, useSelector } from "react-redux"

import { deleteSection, deleteSubSection } from "../../../../../services/operations/courseDetailsAPI"
import { setCourse } from "../../../../../slices/courseSlice"

import ConfirmationModal from "../../../../common/ConfirmationModal"
import SubSectionModal from "./SubSectionModal"

export default function NestedView({ handleChangeEditSectionName }) {
  const { course } = useSelector((state) => state.course)
  const { token } = useSelector((state) => state.auth)
  const dispatch = useDispatch()

  // States to keep track of mode of modal [add, view, edit]
  const [addSubSection, setAddSubsection] = useState(null)
  const [viewSubSection, setViewSubSection] = useState(null)
  const [editSubSection, setEditSubSection] = useState(null)
  // to keep track of confirmation modal
  const [confirmationModal, setConfirmationModal] = useState(null)

  // Delete Section
  const handleDeleleSection = async (sectionId) => {
    const result = await deleteSection({ sectionId, courseId: course._id, token, })
    if (result) {
      dispatch(setCourse(result))
    }
    setConfirmationModal(null)
  }

  // Delete SubSection 
  const handleDeleteSubSection = async (subSectionId, sectionId) => {
    const result = await deleteSubSection({ subSectionId, sectionId, token })
    if (result) {
      // update the structure of course - As we have got only updated section details 
      const updatedCourseContent = course.courseContent.map((section) =>
        section._id === sectionId ? result : section
      )
      const updatedCourse = { ...course, courseContent: updatedCourseContent }
      dispatch(setCourse(updatedCourse))
    }
    setConfirmationModal(null)
  }

  return (
    <>
      <div
        className="rounded-lg bg-white border border-[#E5E7EB] p-4"
        id="nestedViewContainer"
      >
        {course?.courseContent?.map((section) => (
          // Section Dropdown
          <details key={section._id} open className="mb-4 rounded-lg border border-[#E5E7EB] transition-all duration-300">
            {/* Section Dropdown Content */}
            <summary className="flex cursor-pointer items-center justify-between border-b border-[#E5E7EB] p-3 bg-[#F9FAFB] rounded-t-lg hover:bg-[#F3F4F6] transition-all duration-300">
              {/* sectionName */}
              <div className="flex items-center gap-x-3">
                <RxDropdownMenu className="text-xl text-[#6B7280]" />
                <p className="font-medium text-[#111827]">
                  {section.sectionName}
                </p>
              </div>

              <div className="flex items-center gap-x-3">
                {/* Change Edit SectionName button */}
                <button
                  onClick={() =>
                    handleChangeEditSectionName(
                      section._id,
                      section.sectionName
                    )
                  }
                  className="p-1 hover:bg-[#EEF2FF] rounded transition-colors"
                  aria-label="Edit section"
                >
                  <MdEdit className="text-lg text-[#422FAF]" />
                </button>

                <button
                  onClick={() =>
                    setConfirmationModal({
                      text1: "Delete this Section?",
                      text2: "All the lectures in this section will be deleted",
                      btn1Text: "Delete",
                      btn2Text: "Cancel",
                      btn1Handler: () => handleDeleleSection(section._id),
                      btn2Handler: () => setConfirmationModal(null),
                    })
                  }
                  className="p-1 hover:bg-[#FEE2E2] rounded transition-colors"
                  aria-label="Delete section"
                >
                  <RiDeleteBin6Line className="text-lg text-[#EF4444]" />
                </button>

                <span className="text-[#D1D5DB]">|</span>
                <AiFillCaretDown className="text-lg text-[#6B7280]" />
              </div>
            </summary>
            
            <div className="px-4 py-3">
              {/* Render All Sub Sections Within a Section */}
              {section.subSection.map((data) => (
                <div
                  key={data?._id}
                  onClick={() => setViewSubSection(data)}
                  className="flex cursor-pointer items-center justify-between border-b border-[#E5E7EB] px-2 py-3 hover:bg-[#F9FAFB] rounded-md transition-colors"
                >
                  <div className="flex items-center gap-x-3">
                    <RxDropdownMenu className="text-lg text-[#6B7280]" />
                    <p className="font-medium text-[#111827]">
                      {data.title}
                    </p>
                  </div>
                  
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-x-2"
                  >
                    <button
                      onClick={() =>
                        setEditSubSection({ ...data, sectionId: section._id })
                      } 
                      className="p-1 hover:bg-[#EEF2FF] rounded transition-colors"
                      aria-label="Edit lecture"
                    >
                      <MdEdit className="text-lg text-[#422FAF]" />
                    </button>
                    
                    <button
                      onClick={() =>
                        setConfirmationModal({
                          text1: "Delete this Lecture?",
                          text2: "This lecture will be permanently deleted",
                          btn1Text: "Delete",
                          btn2Text: "Cancel",
                          btn1Handler: () =>
                            handleDeleteSubSection(data._id, section._id),
                          btn2Handler: () => setConfirmationModal(null),
                        })
                      }
                      className="p-1 hover:bg-[#FEE2E2] rounded transition-colors"
                      aria-label="Delete lecture"
                    >
                      <RiDeleteBin6Line className="text-lg text-[#EF4444]" />
                    </button>
                  </div>
                </div>
              ))}
              
              {/* Add New Lecture to Section */}
              <button
                onClick={() => setAddSubsection(section._id)}
                className="mt-3 flex items-center gap-x-1 px-3 py-2 text-[#422FAF] hover:bg-[#EEF2FF] rounded-md transition-colors font-medium text-sm"
              >
                <FaPlus className="text-xs" />
                <span>Add Lecture</span>
              </button>
            </div>
          </details>
        ))}
      </div>

      {/* Modal Display */}
      {addSubSection ? (
        <SubSectionModal
          modalData={addSubSection}
          setModalData={setAddSubsection}
          add={true}
        />
      ) : viewSubSection ? (
        <SubSectionModal
          modalData={viewSubSection}
          setModalData={setViewSubSection}
          view={true}
        />
      ) : editSubSection ? (
        <SubSectionModal
          modalData={editSubSection}
          setModalData={setEditSubSection}
          edit={true}
        />
      ) : null}
      
      {/* Confirmation Modal */}
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </>
  )
}