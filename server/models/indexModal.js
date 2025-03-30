// This file ensures all models are registered in the correct order

// Check if we already registered models to avoid duplicate registration
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const registeredModels = Object.keys(mongoose.models);

console.log("Initially registered models:", registeredModels);

// Helper function to require model only if not already registered
const requireModel = (modelName, modelPath) => {
  try {
    if (!mongoose.models[modelName]) {
      console.log(`Registering model: ${modelName}`);
      require(modelPath);
    } else {
      console.log(`Model ${modelName} already registered`);
    }
  } catch (error) {
    console.error(`Error loading model ${modelName} from ${modelPath}: ${error.message}`);
    // Try alternative file case formats if the original fails
    tryAlternativePaths(modelName, modelPath);
  }
};

// Try different case variations for file paths (Vercel is case-sensitive)
const tryAlternativePaths = (modelName, originalPath) => {
  // Handle path parts
  const pathParts = originalPath.split('/');
  const fileName = pathParts[pathParts.length - 1];
  const dirPath = pathParts.slice(0, -1).join('/');
  
  // Try lowercase
  try {
    const lowercasePath = `${dirPath}/${fileName.toLowerCase()}`;
    console.log(`Trying alternative path: ${lowercasePath}`);
    require(lowercasePath);
    console.log(`Successfully loaded ${modelName} from ${lowercasePath}`);
    return true;
  } catch (e) {
    console.log(`Failed to load from lowercase path: ${e.message}`);
  }
  
  // Try uppercase first letter
  try {
    const upperFirstPath = `${dirPath}/${fileName.charAt(0).toUpperCase() + fileName.slice(1)}`;
    console.log(`Trying alternative path: ${upperFirstPath}`);
    require(upperFirstPath);
    console.log(`Successfully loaded ${modelName} from ${upperFirstPath}`);
    return true;
  } catch (e) {
    console.log(`Failed to load from uppercase first letter path: ${e.message}`);
  }
  
  console.error(`All attempts to load model ${modelName} failed`);
  return false;
};

// Model registration
const models = [
  { name: 'User', path: './User' },
  { name: 'Course', path: './Course' },
  { name: 'Section', path: './Section' },
  { name: 'SubSection', path: './Subsection' },
  { name: 'CourseProgress', path: './CourseProgress' },
  { name: 'RatingAndReview', path: './RatingAndRaview' },
  { name: 'Category', path: './Category' },
  { name: 'Profile', path: './Profile' },
  { name: 'OTP', path: './OTP' },
  { name: 'ExamResult', path: './ExamResult' },
  { name: 'Certificate', path: './Certificate' }
];

// Register all models
models.forEach(model => requireModel(model.name, model.path));

// Log all registered models after registration
console.log("Final registered models:", Object.keys(mongoose.models));

// Export mongoose with all models registered
module.exports = mongoose;