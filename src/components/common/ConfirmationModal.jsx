import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX } from "react-icons/fi";

const ConfirmationModal = ({ isOpen, onClose, modalData }) => {
  return (
    <AnimatePresence>
      { (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-1 z-[1000] grid place-items-center overflow-auto bg-black bg-opacity-50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.5, y: -50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.5, y: -50 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="w-11/12 max-w-[400px] rounded-xl border border-richblack-400 bg-richblack-800 p-6"
            onClick={(e) => e.stopPropagation()} // Prevent click from closing the modal
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-richblack-300 hover:text-white transition-colors"
              aria-label="Close modal"
            >
              <FiX size={24} />
            </button>
            <p className="text-2xl font-semibold text-richblack-5">
              {modalData?.text1}
            </p>
            <p className="mt-3 mb-5 leading-6 text-richblack-200">
              {modalData?.text2}
            </p>
            <div className="flex items-center gap-x-4 pt-4">
              <button
                className="cursor-pointer rounded-md bg-[#BB86FC] py-[8px] px-[20px] font-semibold text-black transition-all duration-200 hover:bg-[#BB86FC]/60"
                onClick={modalData?.btn1Handler}
              >
                {modalData?.btn1Text}
              </button>
              <button
                className="cursor-pointer rounded-md bg-richblack-200 py-[8px] px-[20px] font-semibold text-richblack-900 transition-all duration-200 hover:scale-95"
                onClick={modalData?.btn2Handler}
              >
                {modalData?.btn2Text}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmationModal;
