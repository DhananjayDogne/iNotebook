// routes/groupRoutes.js

const express = require('express');
const Group = require('../models/Group');
const User = require('../models/User');
const router = express.Router();

// Create a new group and add users
router.post('/create', async (req, res) => {
    try {
        const { name } = req.body; 

        // Check if all users exist

        if (name.length ===0) {
            return res.status(400).json({ message: 'Give name ' });
        }

        const grp = await Group.findOne({ name: name });
        if (grp) {
            return res.status(400).json({ message: 'Group already exists' });
        }

        const newGroup = new Group({
            name,
            userlist: []  
        });

        await newGroup.save();
        res.status(201).json(newGroup);
        
    } catch (error) {
        res.status(400).json({ message: 'Error creating group', error });
    }
});

// Get group by ID and populate user details
router.get('/:id', async (req, res) => {
    try {
        const group = await Group.findById(req.params.id).populate('userlist');
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        res.status(200).json(group);
    } catch (error) {
        res.status(400).json({ message: 'Error fetching group', error });
    }
});

module.exports = router;
