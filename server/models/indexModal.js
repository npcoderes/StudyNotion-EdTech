// This file ensures all models are registered in the correct order

const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

console.log("Initially registered models:", Object.keys(mongoose.models));

// Debugging function to list available files in the models directory
const debugAvailableFiles = () => {
  try {
    console.log("Checking available model files in:", __dirname);
    const files = fs.readdirSync(__dirname);
    console.log("Available files:", files);
    return files;
  } catch (err) {
    console.error("Error reading model directory:", err.message);
    return [];
  }
};

// List all files in the models directory
const availableFiles = debugAvailableFiles();

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
    
    // Try to find the file with case-insensitive search
    const fileName = modelPath.split('/').pop();
    const matchingFile = availableFiles.find(file => 
      file.toLowerCase() === `${fileName.toLowerCase()}.js`
    );
    
    if (matchingFile) {
      const correctedPath = `./${matchingFile.replace('.js', '')}`;
      console.log(`Found matching file: ${matchingFile}, trying path: ${correctedPath}`);
      try {
        require(correctedPath);
        console.log(`Successfully loaded ${modelName} from ${correctedPath}`);
        return;
      } catch (e) {
        console.error(`Failed to load from corrected path: ${e.message}`);
      }
    }
    
    // If the model is missing, define it inline as a fallback
    defineModelFallback(modelName);
  }
};

// Define basic fallback models if files are missing
const defineModelFallback = (modelName) => {
  console.log(`Creating fallback schema for missing model: ${modelName}`);
  
  try {
    // Create fallback schemas based on model name
    if (modelName === 'ExamResult') {
      const examResultSchema = new mongoose.Schema({
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true
        },
        course: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Course',
          required: true
        },
        score: {
          type: Number,
          required: true
        },
        totalQuestions: {
          type: Number,
          required: true
        },
        correctAnswers: {
          type: Number,
          required: true
        },
        scorePercentage: {
          type: Number,
          required: true
        },
        timeTaken: {
          type: Number, // in seconds
        },
        answers: [{
          questionId: String,
          selectedOption: String,
          isCorrect: Boolean,
          points: Number
        }],
        status: {
          type: String,
          enum: ['passed', 'failed'],
          required: true
        },
        createdAt: {
          type: Date,
          default: Date.now
        }
      });
      
      mongoose.model(modelName, examResultSchema);
      console.log(`Fallback model ${modelName} created successfully`);
    } 
    else if (modelName === 'Certificate') {
      const certificateSchema = new mongoose.Schema({
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true
        },
        course: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Course',
          required: true
        },
        certificateUrl: {
          type: String,
          required: true
        },
        issuedAt: {
          type: Date,
          default: Date.now
        },
        examResult: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'ExamResult'
        },
        scorePercentage: {
          type: Number
        },
        certificateId: {
          type: String,
          unique: true
        }
      });
      
      mongoose.model(modelName, certificateSchema);
      console.log(`Fallback model ${modelName} created successfully`);
    }
  } catch (error) {
    console.error(`Error creating fallback for ${modelName}:`, error.message);
  }
};

// Fix for filename case mismatches - correct model paths
const models = [
  { name: 'User', path: './User' },
  { name: 'Course', path: './Course' },
  { name: 'Section', path: './Section' },
  { name: 'SubSection', path: './Subsection' }, // Corrected from ./Subsection
  { name: 'CourseProgress', path: './CourseProgress' },
  { name: 'RatingAndReview', path: './RatingAndRaview' }, // Corrected from ./RatingAndRaview
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

// Validate critical models exist
const criticalModels = ['User', 'Course', 'Section', 'SubSection', 'ExamResult', 'Certificate'];
criticalModels.forEach(modelName => {
  if (mongoose.models[modelName]) {
    console.log(`✅ Critical model ${modelName} is available`);
  } else {
    console.error(`❌ Critical model ${modelName} is missing`);
  }
});

// Export mongoose with all models registered
module.exports = mongoose;