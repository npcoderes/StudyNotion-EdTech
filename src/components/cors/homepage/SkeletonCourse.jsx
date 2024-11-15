import React from 'react';

const SkeletonCourse = () => {
  return (
    <div className="animate-pulse flex flex-col gap-2 p-4 bg-gray-200 rounded-xl">
      <div className="h-40 bg-pure-greys-50 rounded-md"></div>
      <div className="h-6 bg-pure-greys-50 rounded-md"></div>
      <div className="h-6 bg-pure-greys-50 rounded-md"></div>
      <div className="h-4 bg-pure-greys-50 rounded-md"></div>
    </div>
  );
};

export default SkeletonCourse;