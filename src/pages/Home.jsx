import React from "react";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import HighlightText from "../components/cors/homepage/HighlightText";
import HButton from "./../components/cors/homepage/Button";
import Banner from "../assets/Images/banner.mp4";
import CodeBlocks from "../components/cors/homepage/CodeBlock";
import TimeLinesec from "../components/cors/homepage/TimeLinesec";
import LearningLanguageSection from "./../components/cors/homepage/LearningLanguageSection";
import InstructorSection from "./../components/cors/homepage/InstructorSection";
import Footer from "./../components/common/Footer";
import ExploreSection from "../components/cors/homepage/ExploreSection";
import { motion } from "framer-motion"
import { fadeIn } from "../components/common/Motion";

const Home = () => {
  return (
    <motion.div
     initial={{opacity:0}}
     animate={{ opacity: 1 }}
     transition={{ duration: 0.3, ease: [0.6, 0.01, 0.3, 0.9] }}
     exit={{ opacity: 0 }}
    
    >


      {/* Section-1 */}

      <div className="relative w-11/12 mx-auto flex flex-col max-w-maxContent items-center text-white justify-between">
        <Link to="/signup">
          <div className="group mt-16 p-1 mx-auto rounded-full bg-richblack-800 font-bold text-richblack-200  transition-all duration-200 hover:scale-95 shadow-md border-b-[2px] border-b-richblack-700  ">
            <div className="flex  items-center gap-4 flex-row px-10 rounded-full py-[5px] transition-all duration-200 group-hover:bg-richblack-900">
              <p>Become an Instructor</p>
              <FaArrowRight />
            </div>
          </div>
        </Link>
        <motion.div
                        variants={fadeIn('left', 0.1)}
                        initial='hidden'
                        whileInView={'show'}
                        viewport={{ once: false, amount: 0.1 }}
                        className='text-center text-3xl lg:text-4xl font-semibold mt-7  '
                    >
                        Empower Your Future with
                        <HighlightText text={"Coding Skills"} color={"textgrad2"}/>
                    </motion.div>

                    <motion.div
                        variants={fadeIn('right', 0.1)}
                        initial='hidden'
                        whileInView={'show'}
                        viewport={{ once: false, amount: 0.1 }}
                        className=' mt-4 w-[90%] text-center text-base lg:text-base font-bold text-richblack-300'
                    >
                        With our online coding courses, you can learn at your own pace, from anywhere in the world, and get access to a wealth of resources, including hands-on projects, quizzes, and personalized feedback from instructors.
                    </motion.div>

        <div className="flex flex-row gap-7 mt-8">
          <HButton active={true} linkto={"/signup"}>
            Learn More
          </HButton>
          <HButton active={false} linkto={"/login"}>
            Book a Demo
          </HButton>
        </div>
        <div className="mx-3 my-12  shadow-white drop-video">
          <video muted loop autoPlay>
            <source src={Banner} type="video/mp4" />
          </video>
        </div>

        {/* Code Section 1 */}
        <div>
          <CodeBlocks
            position={"lg:flex-row max-sm:flex-col"}
            heading={
              <div className="text-4xl font-semibold max-sm:text-3xl max-sm:mb-3">
                Unlock Your
                <HighlightText text={"coding potential"} />
                with our online courses
              </div>
            }
            subheading={
              "Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."
            }
            ctabtn1={{
              btnText: "Try it yourself",
              linkto: "/signup",
              active: true,
            }}
            ctabtn2={{
              btnText: "learn more",
              linkto: "/login",
              active: false,
            }}
            codeblock={`<<!DOCTYPE html>\n<html>\n<head><title>Example</title><linkrel="stylesheet"href="styles.css">\n</head>\n`}
            codecolor={"text-yellow-25"}
            backgroundgradint={
              "bg-gradient-to-r from-yellow-400 via-red-500 to-green-500"
            }
          />
        </div>

        {/* Code Section 2 */}
        <div>
          <CodeBlocks
            position={"lg:flex-row-reverse max-sm:flex-col"}
            heading={
              <div className="text-4xl font-semibold w-[40%] max-sm:w-full mb-2">
                Start
                <HighlightText text={" coding in seconds"} />
              </div>
            }
            subheading={
              "Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson."
            }
            ctabtn1={{
              btnText: "Continue Lesson",
              linkto: "/signup",
              active: true,
            }}
            ctabtn2={{
              btnText: "Learn more",
              linkto: "/login",
              active: false,
            }}
            codecolor={"textgrad3"}
            codeblock={`import React from "react";\n import CTAButton from "./Button";\nimport TypeAnimation from "react-type";\nimport { FaArrowRight } from "react-icons/fa";\n\nconst Home = () => {\nreturn (\n<div>Home</div>\n)\n}\nexport default Home;`}
            backgroundgradint={
              "bg-gradient-to-r from-blue-400 via-red-500 to-blue-500"
            }
          />
        </div>
        <ExploreSection />
      </div>

      {/* section-2  */}

      <div className="bg-pure-greys-5 text-richblack-700 ">
        <div className="h-[320px] sec-2">
          <div className="w-11/12 max-w-maxContent flex flex-col items-center justify-between ga-5 mx-auto">
            <div className="h-[150px]"></div>
            <div className="flex flex-row gap-7 text-white lg:mt-4">
              <HButton active={true} linkto={"/signup"}>
                <div className="flex flex-row gap-3 items-center">
                  Explore Full Catalog
                  <FaArrowRight />
                </div>
              </HButton>
              <HButton active={false} linkto={"/login"}>
                <div className="flex flex-row gap-3 items-center">
                  Learn more
                </div>
              </HButton>
            </div>
          </div>
        </div>

        <div className="mx-auto w-11/12 max-w-maxContent flex flex-col items-center justify-between gap-7">
          <div className="flex flex-row max-sm:flex-col gap-12 mb-10 mt-[95px] ">
            <div className="text-4xl font-semibold w-[45%] max-sm:w-full">
              Get the Skills you need for a
              <HighlightText text={"Job that is in demand"} />
            </div>
            <div className="flex flex-col w-[40%] items-start gap-10 max-sm:w-full">
              <div className="text-[16px]">
                The modern StudyNotion is the dictates its own terms. Today, to
                be a competitive specialist requires more than professional
                skills.
              </div>
              <HButton active={true} linkto={"/signup"}>
                <div>Learn More</div>
              </HButton>
            </div>
          </div>
          <TimeLinesec />
          <LearningLanguageSection />
        </div>
      </div>

      {/*Section 3 */}
      <div className="w-11/12 mx-auto max-w-maxContent flex-col items-center justify-between gap-8 first-letter bg-richblack-900 text-white">
        <InstructorSection />

        <h2 className="text-center text-4xl font-semobold mt-10">
          {/* review from Other Learners */}
        </h2>
        {/* Review Slider here */}
      </div>

      {/* Footer  */}
      <Footer />
    </motion.div>
  );
};

export default Home;
