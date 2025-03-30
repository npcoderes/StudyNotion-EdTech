// This file ensures all models are registered in the correct order

// Check if we already registered models to avoid duplicate registration
const mongoose = require('mongoose');
const registeredModels = Object.keys(mongoose.models);

console.log("Initially registered models:", registeredModels);

// Helper function to require model only if not already registered
const requireModel = (modelName, path) => {
  if (!mongoose.models[modelName]) {
    console.log(`Registering model: ${modelName}`);
    require(path);
  } else {
    console.log(`Model ${modelName} already registered`);
  }
};

// Register models in dependency order
requireModel('User', './User');
requireModel('Course', './Course');
requireModel('Section', './Section');
requireModel('SubSection', './Subsection');
requireModel('CourseProgress', './CourseProgress');
requireModel('RatingAndReview', './RatingAndRaview');
requireModel('Category', './Category');
requireModel('Profile', './Profile');
requireModel('OTP', './OTP');
requireModel('ExamResult', './ExamResult');
requireModel('Certificate', './Certificate');

// Log all registered models after registration
console.log("Final registered models:", Object.keys(mongoose.models));

// Export mongoose with all models registered
module.exports = mongoose; 