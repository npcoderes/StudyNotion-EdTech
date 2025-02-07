const Doubt = require('../models/Doubt');
const Reply = require('../models/Reply');
const User = require('../models/User');
const Course = require('../models/Course');

// Create Doubt
exports.createDoubt = async (req, res) => {
    try {
        const { courseId, title, description } = req.body;
        const studentId = req.user.id;

        // Create doubt
        const doubt = await Doubt.create({
            courseId,
            student: studentId,
            title,
            description
        });
 
        
        // Populate student details
        const populatedDoubt = await doubt.populate('student', 'firstName lastName email');

        return res.status(201).json({
            success: true,
            doubt: populatedDoubt
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get Course Doubts
exports.getDoubtsByCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const doubts = await Doubt.find({ courseId })
            .populate('student', 'firstName lastName email')
            .populate({
                path: 'replies',
                populate: {
                    path: 'author',
                    select: 'firstName lastName accountType'
                }
            })
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            doubts
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Add Reply
exports.addReply = async (req, res) => {
    try {
        const { doubtId } = req.params;
        const { content } = req.body;
        const userId = req.user.id;

        // Create reply
        const reply = await Reply.create({
            doubt: doubtId,
            author: userId,
            content,
            isInstructorReply: req.user.accountType === 'Instructor',
        });

        // Update doubt with reply
        await Doubt.findByIdAndUpdate(
            doubtId,
            { $push: { replies: reply._id } },
            {status:'resolved'},
            { new: true }
            
        );

        const populatedReply = await reply.populate('author', 'firstName lastName accountType');

        return res.status(200).json({
            success: true,
            reply: populatedReply
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Resolve Doubt
exports.resolveDoubt = async (req, res) => {
    try {
        const { doubtId } = req.params;
        const updatedDoubt = await Doubt.findByIdAndUpdate(
            doubtId,
            { status: 'resolved' },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            doubt: updatedDoubt
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Upvote Doubt
exports.upvoteDoubt = async (req, res) => {
    try {
        const { doubtId } = req.params;
        const userId = req.user.id;

        const doubt = await Doubt.findById(doubtId);
        const upvoteIndex = doubt.upvotes.indexOf(userId);

        if (upvoteIndex === -1) {
            doubt.upvotes.push(userId);
        } else {
            doubt.upvotes.splice(upvoteIndex, 1);
        }

        await doubt.save();

        return res.status(200).json({
            success: true,
            doubt
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};