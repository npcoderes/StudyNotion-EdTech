import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX } from "react-icons/fi";

const ConfirmationModal = ({ modalData }) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[1000] grid place-items-center overflow-auto bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={modalData?.btn2Handler}
      >
        <motion.div
          initial={{ scale: 0.5, y: -50 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.5, y: -50 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="w-11/12 max-w-[400px] rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-lg relative"
          onClick={(e) => e.stopPropagation()} // Prevent click from closing the modal
        >
          <button
            onClick={modalData?.btn2Handler}
            className="absolute top-4 right-4 text-[#6B7280] hover:text-[#111827] transition-colors p-1 rounded-full hover:bg-[#F3F4F6]"
            aria-label="Close modal"
          >
            <FiX size={20} />
          </button>
          
          <p className="text-xl font-semibold text-[#111827]">
            {modalData?.text1}
          </p>
          
          <p className="mt-3 mb-5 leading-6 text-[#4B5563]">
            {modalData?.text2}
          </p>
          
          <div className="flex items-center gap-x-4 pt-4">
            <button
              className="cursor-pointer rounded-md bg-[#EF4444] py-[8px] px-[20px] font-medium text-white transition-all duration-200 hover:bg-[#DC2626] focus:outline-none focus:ring-2 focus:ring-[#EF4444] focus:ring-offset-2"
              onClick={modalData?.btn1Handler}
            >
              {modalData?.btn1Text}
            </button>
            <button
              className="cursor-pointer rounded-md bg-[#F3F4F6] py-[8px] px-[20px] font-medium text-[#4B5563] transition-all duration-200 hover:bg-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#D1D5DB]"
              onClick={modalData?.btn2Handler}
            >
              {modalData?.btn2Text}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ConfirmationModal;