const mongoose = require("mongoose");

// Define the Option schema for multiple choice questions
const optionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  isCorrect: {
    type: Boolean,
    default: false,
  }
});

// Define the Question schema
const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["mcq", "truefalse", "shortAnswer"],
    default: "mcq",
  },
  options: [optionSchema],
  answers: [String], // For short answer questions
  points: {
    type: Number,
    default: 1,
  },
  explanation: {
    type: String,
  }
});

// Define the Exam Question schema
const examQuestionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['mcq', 'truefalse', 'shortAnswer'],
    default: 'mcq'
  },
  points: {
    type: Number,
    required: true,
    default: 1,
    min: 1
  },
  options: [{
    text: {
      type: String,
      required: function() {
        // Only required for mcq and truefalse question types
        return this.parent().type === 'mcq' || this.parent().type === 'truefalse';
      },
      default: function() {
        // For true/false, provide default values
        if (this.parent().type === 'truefalse') {
          const index = this.parent().options.indexOf(this);
          return index === 0 ? 'True' : 'False';
        }
        return '';
      }
    },
    isCorrect: {
      type: Boolean,
      default: false
    }
  }],
  answers: [{
    type: String,
    required: function() {
      // Only required for shortAnswer type
      return this.parent().type === 'shortAnswer';
    }
  }],
  explanation: {
    type: String,
    trim: true
  }
});

// Define the Exam schema
const examSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: true
  },
  description: {
    type: String,
    trim: true
  },
  timeLimit: {
    type: Number,
    default: 60, // 60 minutes
    min: 5
  },
  passingScore: {
    type: Number,
    default: 70, // 70%
    min: 1,
    max: 100
  },
  showResults: {
    type: Boolean,
    default: true
  },
  randomizeQuestions: {
    type: Boolean,
    default: false
  },
  questions: [examQuestionSchema]
});

// Define the Courses schema
const coursesSchema = new mongoose.Schema({
	courseName: { type: String },
	courseDescription: { type: String },
	instructor: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: "User",
	},
	whatYouWillLearn: {
		type: String,
	},
	courseContent: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Section",
		},
	],
	ratingAndReviews: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "RatingAndReview",
		},
	],
	price: {
		type: Number,
	},
	thumbnail: {
		type: String,
	},
	tag: {
		type: [Array],
		required: true,
	},
	category: {
		type: mongoose.Schema.Types.ObjectId,
		// required: true,
		ref: "Category",
	},
	studentsEnrolled: [
		{
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "User",
		},
	],
	instructions: {
		type: [String],
	},
	status: {
		type: String,
		enum: ["Draft", "Published"],
	},
	duration : {
		type: String,
        require : true,
	},
	createdAt :{
		type: Date,
        default: Date.now,
	},
	hasExam: {
		type: Boolean,
		default: false,
	},
	exam: {
		type: examSchema,
		required: function() {
			return this.hasExam;
		}
	},
});

// Export the Courses model
module.exports = mongoose.model("Course", coursesSchema);