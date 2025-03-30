const express = require("express");
const app = express();

const database = require("./config/database");

//database connect
database.connect();

// Load all models to ensure they're registered
const mongoose = require('./models/indexModal');

// Log all registered models for debugging
console.log('Registered Mongoose models:', Object.keys(mongoose.models));

// Add this after loading models but before setting up routes
console.log('All registered Mongoose model names with case:');
Object.keys(mongoose.models).forEach(modelName => {
  console.log(`- "${modelName}"`);
});

// Also check if lowercase/uppercase models exist
const modelCases = {
  "User": !!mongoose.models.User,
  "user": !!mongoose.models.user,
  "Course": !!mongoose.models.Course,
  "course": !!mongoose.models.course,
  "Certificate": !!mongoose.models.Certificate,
  "certificate": !!mongoose.models.certificate,
};
console.log('Model case sensitivity check:', modelCases);

const userRoutes = require("./routes/User");
const profileRoutes = require("./routes/Profile");
const paymentRoutes = require("./routes/Payments");
const courseRoutes = require("./routes/Course");
const adminRoutes = require("./routes/admin");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const {cloudinaryConnect } = require("./config/cloudinary");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");
const doubtRoutes = require("./routes/Doubt");
const examRoutes = require('./routes/examRoutes');
const certificateRoutes = require('./routes/certificateRoutes');

dotenv.config();
const PORT = process.env.PORT || 4000;

//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
	cors({
		origin:"*",
		credentials:true,
	})
)

app.use(
	fileUpload({
		useTempFiles:true,
		tempFileDir:"/tmp",
	})
)
//cloudinary connection
cloudinaryConnect();

//routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/doubts", doubtRoutes);
app.use('/api/v1/exams', examRoutes);
app.use("/api/v1/certificates", certificateRoutes);

//def route

app.get("/", (req, res) => {
	return res.json({
		success:true,
		message:'Your server is up and running....'
	});
});

// Global error handling middleware with specific handling for Mongoose errors
app.use((err, req, res, next) => {
  console.error("Global error handler caught:", err);
  
  // Special handling for Mongoose errors
  if (err.name === 'MissingSchemaError') {
    console.error("MissingSchemaError detected. Registered models:", Object.keys(mongoose.models));
    return res.status(500).json({
      success: false,
      message: "Internal database error",
      error: "Schema registration issue",
      hint: "Server needs to be restarted to fix model registration"
    });
  }
  
  // Handle other types of errors
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    error: process.env.NODE_ENV === 'development' ? err.stack : {}
  });
});

app.listen(PORT, () => {
	console.log(`App is running at ${PORT}`)
})

