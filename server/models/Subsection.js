const mongoose = require("mongoose");

const SubSectionSchema = new mongoose.Schema({
	title: { type: String },
	timeDuration: { type: String },
	description: { type: String },
	videoUrl: { type: String },
	otherUrl: { type: String,
		default: null,
	 },
});

module.exports = mongoose.model("SubSection", SubSectionSchema);
