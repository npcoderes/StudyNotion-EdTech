import React from "react";
import HighlightText from "../components/cors/homepage/HighlightText";
import about1 from "../../src/assets/Images/aboutus1.webp";
import about2 from "../../src/assets/Images/aboutus2.webp";
import about3 from "../../src/assets/Images/aboutus3.webp";
import fs from "../assets/Images/FoundingStory.png";
import { motion } from "framer-motion";
import { fadeIn } from "../components/common/Motion";
import Footer from "../components/common/Footer";
import LearningGrid from "../components/AboutUs/LearningGrid";
import Contactform from "../components/cors/ContactUS/Contactform";

const About = () => {
  return (
    <div className="bg-[#F9F9F9] text-black">
      {/* Section-1 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="min-h-[514px] "
      >
        <div className="relative w-11/12 max-w-maxContent flex flex-col items-center mx-auto">
          {/* sec-1 */}
          <div className="flex flex-col lg:mt-20 mt-6">
            <p className="text-base text-gray-600 font-medium text-center">
              About us
            </p>
            <div className="mt-6 flex flex-col items-center gap-4">
              <motion.h1
                variants={fadeIn("right", 0.1)}
                initial="hidden"
                whileInView={"show"}
                viewport={{ once: false, amount: 0.1 }}
                className="text-4xl text-black text-center w-[60%] max-sm:w-full max-sm:text-left mx-auto font-semibold"
              >
                Driving Innovation in Online Education for a{" "}
                <HighlightText text={" Brighter Future"} color={"text-[#4CAF50]"} />
              </motion.h1>
              <motion.p
                variants={fadeIn("left", 0.1)}
                initial="hidden"
                whileInView={"show"}
                viewport={{ once: false, amount: 0.1 }}
                className="text-gray-700 w-[59%] mx-auto text-center text-base max-sm:text-left max-sm:w-full"
              >
                Studynotion is at the forefront of driving innovation in online
                education. We're passionate about creating a brighter future by
                offering cutting-edge courses, leveraging emerging technologies,
                and nurturing a vibrant learning community.
              </motion.p>
            </div>
          </div>
          {/* sec-2 */}
          <motion.div className="flex relative">
            <div className="aboutgrd w-[400px] blur-[50px] h-12 shadow-xl drop-shadow-2xl bg-gradient-to-r from-[#4CAF50] via-[#81C784] to-[#4CAF50] absolute -translate-x-[400px] translate-y-[80px] left-[800px]"></div>
            <div className="relative left-[50%] grid w-[100%] translate-x-[-50%] translate-y-[10%] grid-cols-3 gap-3 lg:gap-5 max-sm:translate-y-[80px]">
              <img src={about1} alt="About1" className="" loading="lazy" />
              <img src={about2} alt="About2" className="" loading="lazy" />
              <img src={about3} alt="About3" loading="lazy" />
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* section-2 */}
      <motion.div
        variants={fadeIn("right", 0.1)}
        initial="hidden"
        whileInView={"show"}
        viewport={{ once: false, amount: 0.3 }}
        className="border-b-[1px] border-[#4B5563]"
      >
        <div className="min-h-[336px] w-11/12 max-w-maxContent flex justify-center mx-auto mt-20 items-center">
          <p className="text-3xl leading-[56px] text-gray-800 text-center max-sm:text-2xl">
            " We are passionate about revolutionizing the way we learn. Our
            innovative platform <HighlightText text={" combines technology"} color={"text-[#4CAF50]"} />,{" "}
            <HighlightText text={"expertise"} color={"text-[#4CAF50]"} /> , and
            community to create an{" "}
            <HighlightText
              text={"unparalleled educational experience"}
              color={"text-[#4CAF50]"}
            />
            . "
          </p>
        </div>
      </motion.div>

      {/* section-3 */}
      <section>
        <div className="mx-auto flex w-11/12 max-w-maxContent flex-col justify-between gap-10 text-gray-800">
          <div className="flex flex-col items-center gap-10 lg:flex-row justify-between">
            <motion.div
              variants={fadeIn("right", 0.1)}
              initial="hidden"
              whileInView={"show"}
              viewport={{ once: false, amount: 0.1 }}
              className="my-24 flex lg:w-[50%] flex-col gap-10"
            >
              <h1 className="bg-gradient-to-br from-[#4CAF50] to-[#81C784] bg-clip-text text-4xl font-semibold text-transparent lg:w-[70%] ">
                Our Founding Story
              </h1>
              <p className="text-base font-medium text-gray-700 lg:w-[95%]">
                Our e-learning platform was born out of a shared vision and
                passion for transforming education. It all began with a group of
                educators, technologists, and lifelong learners who recognized
                the need for accessible, flexible, and high-quality learning
                opportunities in a rapidly evolving digital world.
              </p>
              <p className="text-base font-medium text-gray-700 lg:w-[95%]">
                As experienced educators ourselves, we witnessed firsthand the
                limitations and challenges of traditional education systems. We
                believed that education should not be confined to the walls of a
                classroom or restricted by geographical boundaries. We
                envisioned a platform that could bridge these gaps and empower
                individuals from all walks of life to unlock their full
                potential.
              </p>
            </motion.div>

            <motion.div
              variants={fadeIn("left", 0.1)}
              initial="hidden"
              whileInView={"show"}
              viewport={{ once: false, amount: 0.1 }}
            >
              <img
                src={fs}
                alt="FoundingStory"
                className="shadow-[0_0_20px_0] shadow-[#4CAF50]"
                loading="lazy"
              />
            </motion.div>
          </div>

          <div className="flex flex-col items-center lg:gap-10 lg:flex-row justify-between">
            <motion.div
              variants={fadeIn("right", 0.1)}
              initial="hidden"
              whileInView={"show"}
              viewport={{ once: false, amount: 0.1 }}
              className="my-24 flex lg:w-[40%] flex-col gap-10"
            >
              <h1 className="bg-gradient-to-b from-[#4CAF50] to-[#81C784] bg-clip-text text-4xl font-semibold text-transparent lg:w-[70%] ">
                Our Vision
              </h1>
              <p className="text-base font-medium text-gray-700 lg:w-[95%]">
                With this vision in mind, we set out on a journey to create an
                e-learning platform that would revolutionize the way people
                learn. Our team of dedicated experts worked tirelessly to
                develop a robust and intuitive platform that combines
                cutting-edge technology with engaging content, fostering a
                dynamic and interactive learning experience.
              </p>
            </motion.div>

            <motion.div
              variants={fadeIn("left", 0.1)}
              initial="hidden"
              whileInView={"show"}
              viewport={{ once: false, amount: 0.1 }}
              className="my-24 flex lg:w-[40%] flex-col gap-10"
            >
              <h1 className="bg-gradient-to-b from-[#1FA2FF] via-[#12D8FA] to-[#A6FFCB] text-transparent bg-clip-text text-4xl font-semibold lg:w-[70%] ">
                Our Mission
              </h1>
              <p className="text-base font-medium text-gray-700 lg:w-[95%]">
                Our mission goes beyond just delivering courses online. We
                wanted to create a vibrant community of learners, where
                individuals can connect, collaborate, and learn from one
                another. We believe that knowledge thrives in an environment of
                sharing and dialogue, and we foster this spirit of collaboration
                through forums, live sessions, and networking opportunities.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* section-4 */}
      <div className="bg-[#E2E8F0] min-h-[256px] lg:h-[256px] flex items-center">
        <div className="w-11/12 max-w-maxContent flex flex-row mx-auto justify-between items-center text-gray-800 max-sm:grid max-sm:grid-cols-2 max-sm:gap-5">
          <div className="flex justify-center flex-col items-center gap-2">
            <p className="text-3xl text-[#4CAF50] font-bold">5K</p>
            <p className="text-base text-gray-600 font-semibold">Active Students</p>
          </div>
          <div className="flex justify-center flex-col items-center gap-2">
            <p className="text-3xl text-[#4CAF50] font-bold">10+</p>
            <p className="text-base text-gray-600 font-semibold">Mentors</p>
          </div>
          <div className="flex justify-center flex-col items-center gap-2">
            <p className="text-3xl text-[#4CAF50] font-bold">200+</p>
            <p className="text-base text-gray-600 font-semibold">Courses</p>
          </div>
          <div className="flex justify-center flex-col items-center gap-2">
            <p className="text-3xl text-[#4CAF50] font-bold">50+</p>
            <p className="text-base text-gray-600 font-semibold">Awards</p>
          </div>
        </div>
      </div>

      {/* section-5 */}
      <section className="w-11/12 max-w-maxContent mx-auto flex flex-col justify-between gap-10 text-black my-10">
        <LearningGrid />
      </section>
      <section className="w-11/12 max-w-maxContentTab mx-auto flex flex-col justify-between gap-10 text-black my-10">
        <Contactform />
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default About;
