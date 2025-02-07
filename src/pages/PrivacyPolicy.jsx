import React from "react";
import { FaEnvelope } from "react-icons/fa";
import { motion } from "framer-motion";

const PrivacyPolicy = () => {
  return (
    <div className="bg-richblack-900 text-richblack-5 min-h-screen py-12 mt-16">
      <div className="w-11/12 max-w-4xl mx-auto">
        {/* Page Title */}
        <motion.h1
          className="text-4xl md:text-5xl font-bold text-center mb-10 text-yellow-50"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Privacy Policy
        </motion.h1>

        {/* Sections */}
        <div className="space-y-10">
          {/* Introduction */}
          <section className="bg-richblack-800 p-6 rounded-lg shadow-lg transition duration-300 hover:shadow-2xl">
            <h2 className="text-2xl font-semibold mb-4 text-yellow-50">Introduction</h2>
            <p className="text-richblack-100">
              Welcome to <span className="font-semibold text-yellow-50">StudyNotion</span>. This Privacy Policy explains how we collect, use, and protect your data when using our platform.  
              <br />
              <span className="italic text-yellow-100">Last updated: {new Date().toLocaleDateString()}</span>
            </p>
          </section>

          {/* Course Creation & Revenue */}
          <section className="bg-richblack-800 p-6 rounded-lg shadow-lg transition duration-300 hover:shadow-2xl">
            <h2 className="text-2xl font-semibold mb-4 text-yellow-50">Course Creation & Revenue</h2>
            <ul className="list-disc list-inside space-y-3 text-richblack-100">
              <li>Instructors earn <span className="font-semibold text-yellow-50">80%</span> of course revenue.</li>
              <li>StudyNotion retains <span className="font-semibold text-yellow-50">20%</span> as a platform fee.</li>
              <li>Payments are processed securely.</li>
              <li>Earnings are disbursed <span className="font-semibold text-yellow-50">monthly</span>.</li>
            </ul>
          </section>

          {/* Course Validity */}
          <section className="bg-richblack-800 p-6 rounded-lg shadow-lg transition duration-300 hover:shadow-2xl">
            <h2 className="text-2xl font-semibold mb-4 text-yellow-50">Course Validity</h2>
            <ul className="list-disc list-inside space-y-3 text-richblack-100">
              <li>Access valid for <span className="font-semibold text-yellow-50">1 year</span> from enrollment.</li>
              <li>Students receive expiration reminders.</li>
              <li>Certificates are awarded upon completion.</li>
            </ul>
          </section>

          {/* Data Collection */}
          <section className="bg-richblack-800 p-6 rounded-lg shadow-lg transition duration-300 hover:shadow-2xl">
            <h2 className="text-2xl font-semibold mb-4 text-yellow-50">Data Collection</h2>
            <p className="text-richblack-100 mb-4">We collect and process the following:</p>
            <ul className="list-disc list-inside space-y-3 text-richblack-100">
              <li>Personal information (name, email, etc.).</li>
              <li>Course progress & completion data.</li>
              <li>Payment details.</li>
              <li>Platform interaction data.</li>
            </ul>
          </section>

          {/* User Rights */}
          {/* <section className="bg-richblack-800 p-6 rounded-lg shadow-lg transition duration-300 hover:shadow-2xl">
            <h2 className="text-2xl font-semibold mb-4 text-yellow-50">Your Rights</h2>
            <ul className="list-disc list-inside space-y-3 text-richblack-100">
              <li>Access & review personal data.</li>
              <li>Request corrections or deletion.</li>
              <li>Withdraw data processing consent.</li>
              <li>Request data portability.</li>
            </ul>
          </section> */}

          {/* Contact Information */}
          <section className="bg-richblack-800 p-6 rounded-lg shadow-lg transition duration-300 hover:shadow-2xl flex flex-col items-center text-center">
            <h2 className="text-2xl font-semibold mb-4 text-yellow-50">Contact Us</h2>
            <p className="text-richblack-100">
              Have privacy concerns? Reach out to us at:
            </p>
            <div className="flex items-center gap-3 mt-3">
              <FaEnvelope className="text-yellow-50 text-xl" />
              <span className="text-yellow-100 font-semibold">studynotionedtech7@gmail.com</span>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
