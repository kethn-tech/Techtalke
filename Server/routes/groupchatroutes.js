const router = require('express').Router();
const { createGroup, getGroupChats, addMembers, removeMember, leaveGroup } = require('../controllers/GroupChatController');
const verifyToken = require('../middlewares/AuthMiddleware');

router.post('/create', verifyToken, createGroup);
router.get('/list', verifyToken, getGroupChats);
router.post('/add-members', verifyToken, addMembers);
router.post('/remove-member', verifyToken, removeMember);
router.post('/leave', verifyToken, leaveGroup);

module.exports = router;