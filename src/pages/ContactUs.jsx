import React from "react";
import ContactDetails from "../components/cors/ContactUS/ContactDetails";
import ContactForm from "../components/cors/ContactUS/ContactUsForm";

import Footer from "../components/common/Footer";

const ContactUs = () => {
  return (
    <section>
      <div className="mx-auto mt-20 flex w-11/12 max-w-maxContent flex-col justify-between gap-10 text-white lg:flex-row">
        {/* Contact Details */}
        <div className="lg:w-[40%]">
          <ContactDetails />
        </div>

        {/* Contact Form */}
        <div className="lg:w-[50%] border border-richblack-600 lg:p-14 rounded-lg p-6 max-sm:p-3">
          <h1 className="text-4xl leading-10 font-semibold text-richblack-5 max-md:text-2xl">
            Got a Idea? We&apos;ve got the skills. Let&apos;s team up
          </h1>
          <p className="mt-2">
            Tell us more about yourself and what you&apos;re got in mind.
          </p>

          <div className="mt-7">
            <ContactForm />
          </div>
        </div>
      </div>

      {/* Reviws from Other Learner */}
      <div className=" my-20 px-5 text-white ">
        <h1 className="text-center text-4xl font-semibold mt-8">
          Reviews from other learners
        </h1>
        {/* <ReviewSlider /> */}
      </div>

      {/* footer */}
      <Footer />
    </section>
  );
};

export default ContactUs;
