const GroupChat = require('../models/GroupChatModel');
const User = require('../models/UserModel');
const Message = require('../models/MessageModel');

exports.createGroup = async (req, res) => {
    try {
        const { name, description, members } = req.body;
        const creator = req.user.id;

        // Create new group chat
        const groupChat = await GroupChat.create({
            name,
            description,
            creator,
            admins: [creator],
            members: [creator, ...members]
        });

        // Populate creator and members
        await groupChat.populate(['creator', 'members']);

        res.status(201).json({
            success: true,
            groupChat
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating group chat'
        });
    }
};

exports.getGroupChats = async (req, res) => {
    try {
        const userId = req.user.id;

        const groupChats = await GroupChat.find({
            members: userId
        }).populate(['creator', 'members', 'lastMessage']);

        res.status(200).json({
            success: true,
            groupChats
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching group chats'
        });
    }
};

exports.addMembers = async (req, res) => {
    try {
        const { groupId, members } = req.body;
        const userId = req.user.id;

        const groupChat = await GroupChat.findById(groupId);

        if (!groupChat) {
            return res.status(404).json({
                success: false,
                message: 'Group not found'
            });
        }

        // Check if user is admin
        if (!groupChat.admins.includes(userId)) {
            return res.status(403).json({
                success: false,
                message: 'Only admins can add members'
            });
        }

        // Add new members
        groupChat.members.push(...members);
        await groupChat.save();
        await groupChat.populate(['creator', 'members']);

        res.status(200).json({
            success: true,
            groupChat
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error adding members'
        });
    }
};

exports.removeMember = async (req, res) => {
    try {
        const { groupId, memberId } = req.body;
        const userId = req.user.id;

        const groupChat = await GroupChat.findById(groupId);

        if (!groupChat) {
            return res.status(404).json({
                success: false,
                message: 'Group not found'
            });
        }

        // Check if user is admin
        if (!groupChat.admins.includes(userId)) {
            return res.status(403).json({
                success: false,
                message: 'Only admins can remove members'
            });
        }

        // Remove member
        groupChat.members = groupChat.members.filter(id => id.toString() !== memberId);
        await groupChat.save();
        await groupChat.populate(['creator', 'members']);

        res.status(200).json({
            success: true,
            groupChat
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error removing member'
        });
    }
};

exports.leaveGroup = async (req, res) => {
    try {
        const { groupId } = req.body;
        const userId = req.user.id;

        const groupChat = await GroupChat.findById(groupId);

        if (!groupChat) {
            return res.status(404).json({
                success: false,
                message: 'Group not found'
            });
        }

        // Remove user from members
        groupChat.members = groupChat.members.filter(id => id.toString() !== userId);
        
        // If user is admin, remove from admins
        if (groupChat.admins.includes(userId)) {
            groupChat.admins = groupChat.admins.filter(id => id.toString() !== userId);
        }

        // If user is creator and there are other admins, transfer ownership
        if (groupChat.creator.toString() === userId && groupChat.admins.length > 0) {
            groupChat.creator = groupChat.admins[0];
        }

        await groupChat.save();

        res.status(200).json({
            success: true,
            message: 'Successfully left the group'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error leaving group'
        });
    }
};