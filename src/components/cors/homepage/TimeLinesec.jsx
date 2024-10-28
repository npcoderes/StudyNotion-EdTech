import React from "react";
import Logo1 from "../../../assets/TimeLineLogo/Logo1.svg";
import Logo2 from "../../../assets/TimeLineLogo/Logo2.svg";
import Logo3 from "../../../assets/TimeLineLogo/Logo3.svg";
import Logo4 from "../../../assets/TimeLineLogo/Logo4.svg";
import timelineImage from "../../../assets/Images/TimelineImage.png";

const timeline = [
  {
    Logo: Logo1,
    heading: "Leadership",
    Description: "Fully committed to the success company",
  },
  {
    Logo: Logo2,
    heading: "Responsibility",
    Description: "Students will always be our top priority",
  },
  {
    Logo: Logo3,
    heading: "Flexibility",
    Description: "The ability to switch is an important skills",
  },
  {
    Logo: Logo4,
    heading: "Solve the problem",
    Description: "Code your way to a solution",
  },
];

const TimeLinesec = () => {
  return (
    <div>
      <div className="flex flex-row ga-15 items-center max-sm:flex-col">
        <div className="w-[45%] flex flex-col gap-5 max-sm:w-full  max-sm:mb-3 mx-auto relative">
          <div className="h-[300px] w-[1px] border-l-2  absolute top-10 my-2 border-dotted left-6 border-pure-greys-25"></div>
          {timeline.map((element, index) => (
            <div className="flex flex-row gap-8 mb-8 max-sm:mb-6" key={index}>
              <div className="w-[50px] h-[50px] bg-pure-greys-5 flex items-center justify-center flex-col realtive z-10 rounded-full">
                <img src={element.Logo} />
              </div>

              <div>
                <h2 className="font-semibold text-[18px]">{element.heading}</h2>
                <p className="text-base">{element.Description}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="relative sec-sh shadow-blue-200 left-shadow ">
          <img
            src={timelineImage}
            alt="timelineImage"
            className="shadow-white object-cover h-fit"
          />
          <div className=" absolute bg-caribbeangreen-700 flex flex-row text-white uppercase py-7 left-[50%] translate-x-[-50%] translate-y-[-50%] w-[90%]   ">
            <div className="flex flex-row gap-5 max-sm:gap-3 items-center border-r border-caribbeangreen-300 px-7">
              <p className="text-base font-bold">10</p>
              <p className="text-caribbeangreen-300 text-xs">
                Years of Experience
              </p>
            </div>

            <div className="flex gap-5 max-sm:gap-3 items-center px-7">
              <p className="text-base font-bold">250</p>
              <p className="text-caribbeangreen-300 text-xs">TYpe of Courses</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeLinesec;
