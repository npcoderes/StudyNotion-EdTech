import React from "react";
import ContactDetails from "../components/cors/ContactUS/ContactDetails";
import ContactForm from "../components/cors/ContactUS/ContactUsForm";

import Footer from "../components/common/Footer";

const ContactUs = () => {
  return (
    <section className="bg-[#F9F9F9] text-black mt-10">
      <div className="mx-auto mt-20 flex w-11/12 max-w-maxContent flex-col justify-between gap-10 lg:flex-row">
        {/* Contact Details */}
        <div className="lg:w-[40%]">
          <ContactDetails />
        </div>

        {/* Contact Form */}
        <div className="lg:w-[50%] border border-[#4B5563] lg:p-14 rounded-lg p-6 max-sm:p-3 bg-white shadow-md mb-7">
          <h1 className="text-4xl leading-10 font-semibold text-black max-md:text-2xl">
            Got an Idea? We&apos;ve got the skills. Let&apos;s team up
          </h1>
          <p className="mt-2 text-gray-700">
            Tell us more about yourself and what you&apos;re got in mind.
          </p>

          <div className="mt-7">
            <ContactForm />
          </div>
        </div>
      </div>

  
      {/* <div className="my-20 px-5 text-black">
        <h1 className="text-center text-4xl font-semibold mt-8">
          Reviews from other learners
        </h1>
        
      </div> */}

      {/* Footer */}
      <Footer />
    </section>
  );
};

export default ContactUs;
