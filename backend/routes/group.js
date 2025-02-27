const express = require('express');
const Group = require('../models/Group');
const User = require('../models/User');
const Contact = require('../models/Contact');
const fetchuser = require('../middleware/fetchuser');
const router = express.Router();


router.get('/contact/:id', async (req, res) => {
    try {
        const id  = req.params.id;
        // Fetch the group and populate the contacts
        const contacts = await Contact.find({ group: id});

        if (!contacts) {
            return res.status(202).json([]);
        }

        return res.status(200).json(contacts);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error fetching contacts', error: error.message });
    }
});


// Create a new group and add users
router.post('/creategroup',fetchuser, async (req, res) => {
    try {
        const { name } = req.body; 
        const createdBy = req.user.id;
        // Check if all users exist

        const user = await User.find({ _id: { $in: createdBy } });

        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }
        if (name.length ===0) {
            return res.status(400).json({ message: 'Give name ' });
        }

        const grp = await Group.findOne({ name: name, createdBy: createdBy });
        if (grp) {
            return res.status(400).json({ message: 'Group already exists' });
        }

        const newGroup = new Group({
            name,
            createdBy,
            userlist: [createdBy]  
        });

        const group = await newGroup.save();
        
        await user.group.push(group._id);
        await user.save();

        res.status(201).json(newGroup);

    } catch (error) {
        res.status(400).json({ message: 'Error creating group', error });
    }
});


// Add a user to an existing group
router.post('/addUserToGroup', async (req, res) => {
    try {
        const { groupId, userId } = req.body;

        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (group.userlist.includes(userId)) {
            return res.status(400).json({ message: 'User is already in this group' });
        }

        group.userlist.push(userId);
        await group.save();

        user.group.push(groupId);
        await user.save();

        res.status(200).json({ message: 'User added to group successfully' });

    } catch (error) {
        console.error('Error adding user to group:', error);
        res.status(500).json({ message: 'Error adding user to group', error });
    }
});


// Create a new contact in a group
router.post('/createcontact', fetchuser, async (req, res) => {
    // console.log(req.body);
    try {
        const { name, email, mobile, address, mother, father, groupId } = req.body;

        if (!name || !email || !mobile || !groupId ) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }


        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const newContact = new Contact({
            user: req.user.id,  
            group: groupId, 
            name,
            email,
            mobile,
            address,
            mother,
            father,
        });

        const contact = await newContact.save();
        group.contacts.push(contact._id);
        await group.save();
        console.log('Contact added successfully', contact);
        res.status(201).json({ message: 'Contact added successfully', contact });

    } catch (error) {
        console.error('Error creating contact:', error);
        res.status(500).json({ message: 'Error creating contact', error });
    }
});

router.get('/fetchallgroups', async (req, res) => {
    try {
        const group = await Group.find({});
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        res.status(200).json(group);
    } catch (error) {
        res.status(400).json({ message: 'Error fetching group', error });
    }
});

module.exports = router;
