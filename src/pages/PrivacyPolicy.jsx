import React from 'react'

const PrivacyPolicy = () => {
  return (
    <div className="bg-richblack-900 text-richblack-5 min-h-screen mt-8">
      <div className="w-11/12 max-w-maxContent mx-auto py-12 md:py-16">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">Privacy Policy</h1>
        
        <div className="space-y-8">
          {/* Introduction */}
          <section className="bg-richblack-800 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4 text-yellow-50">Introduction</h2>
            <p className="text-richblack-100">
              Welcome to StudyNotion. This Privacy Policy outlines how we collect, use, and protect your information when you use our platform.
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </section>

          {/* Course Creation & Revenue */}
          <section className="bg-richblack-800 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4 text-yellow-50">Course Creation & Revenue Policy</h2>
            <ul className="list-disc list-inside space-y-3 text-richblack-100">
              <li>Instructors receive 80% of the course price for each student enrollment</li>
              <li>StudyNotion retains 20% as platform fee for maintenance and services</li>
              <li>Payments are processed securely through our payment gateway</li>
              <li>Instructor earnings are disbursed on a monthly basis</li>
            </ul>
          </section>

          {/* Course Validity */}
          <section className="bg-richblack-800 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4 text-yellow-50">Course Validity</h2>
            <ul className="list-disc list-inside space-y-3 text-richblack-100">
              <li>Course access is valid for 1 year from the date of enrollment</li>
              <li>Students will be notified before course expiration</li>
              <li>Course certificates are issued upon completion</li>
            </ul>
          </section>

          {/* Data Collection */}
          <section className="bg-richblack-800 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4 text-yellow-50">Data Collection</h2>
            <p className="text-richblack-100 mb-4">We collect and process the following information:</p>
            <ul className="list-disc list-inside space-y-3 text-richblack-100">
              <li>Personal information (name, email, contact details)</li>
              <li>Course progress and completion data</li>
              <li>Payment information</li>
              <li>Usage statistics and interaction with course content</li>
            </ul>
          </section>

          {/* User Rights */}
          <section className="bg-richblack-800 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4 text-yellow-50">Your Rights</h2>
            <ul className="list-disc list-inside space-y-3 text-richblack-100">
              <li>Access your personal data</li>
              <li>Request data correction or deletion</li>
              <li>Withdraw consent for data processing</li>
              <li>Request data portability</li>
            </ul>
          </section>

          {/* Contact Information */}
          <section className="bg-richblack-800 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4 text-yellow-50">Contact Us</h2>
            <p className="text-richblack-100">
              For any privacy-related concerns or queries, please contact us at:
              <br />
              Email: studynotionedtech7@gmail.com
              <br />
              
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPolicy