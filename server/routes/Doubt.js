const express = require('express');
const router = express.Router();
const { auth, isStudent, isInstructor } = require('../middleware/auth');
const {
    createDoubt,
    getDoubtsByCourse,
    addReply,
    upvoteDoubt,
    resolveDoubt,
} = require('../controllers/Doubt');

// Doubt Routes
router.post('/',auth, createDoubt);
router.get('/course/:courseId', getDoubtsByCourse);
router.post('/:doubtId/reply', auth, addReply);
router.patch('/:doubtId/upvote', auth, upvoteDoubt);
router.patch('/:doubtId/resolve', auth, isInstructor, resolveDoubt);


module.exports = router;