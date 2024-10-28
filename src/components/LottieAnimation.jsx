import React from 'react';
import { Lottie } from 'lottie-react';
import animationData from '../components/common/Animation - 1730105261015.json'; // Update the path to your JSON file

const LottieAnimation = () => {
  return (
    <Lottie
      animationData={animationData}
      loop={true} // Set to true if you want the animation to loop
      autoplay={true} // Set to true to start playing the animation immediately
      style={{ width: '100%', height: '100%' }} // Adjust size as needed
    />
  );
};

export default LottieAnimation;