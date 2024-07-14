import React from "react";
import { MdPeopleAlt } from "react-icons/md";
import { BsCalendarEventFill } from "react-icons/bs";
const CourseCard = ({ key, cardData, currentCard, SetCurrentCard }) => {
  let data = [cardData];
  return (
    <div>
      {data.map((card, index) => {
        return (
          <div key={index} className={`flex flex-col gap-8 ${(currentCard===card.heading) ? " bg-white text-richblack-500 current-tab":"bg-richblack-800"} max-w-[341.33px] py-6 px-5 shadow-yellow-50 `}>
            <p className={`${(currentCard===card.heading) ? "text-black":""} font-semibold text-xl `}>{card.heading}
               
            </p>
            <p className="max-w-[90%]">{card.description}</p>
            <div className="flex justify-between border-t-2 border-dashed pt-3">
              <p className={`flex gap-2 items-center text-base text-center ${(currentCard===card.heading) ? "text-blue-500":""} font-medium`}>
                <MdPeopleAlt /> {card.level}
              </p>
              <p className={`flex gap-2 items-center text-base text-center ${(currentCard===card.heading) ? "text-blue-500":""} font-medium`}>
                {" "}
                <BsCalendarEventFill />
                {card.lessionNumber} Lessons
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CourseCard;
