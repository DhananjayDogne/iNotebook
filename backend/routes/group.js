const express = require('express');
const Group = require('../models/Group');
const User = require('../models/User');
const Contact = require('../models/Contact');
const fetchuser = require('../middleware/fetchuser');
const router = express.Router();

// contacts of a group according to the group id
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

        const user = await User.findById(req.user.id);

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

// edit group contact
router.put('/editcontact/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const { name, email, mobile, mother, father, address } = req.body;

        if (!name || !email || !mobile) {
            return res.status(400).json({ message: 'Name, Email, and Mobile are required' });
        }

        const updatedContact = await Contact.findByIdAndUpdate(
            id,
            { name, email, mobile, mother, father, address },
            { new: true } 
        );

        if (!updatedContact) {
            return res.status(404).json({ message: 'Contact not found' });
        }

        // Successfully updated the contact
        return res.status(200).json(updatedContact);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error updating contact', error: error.message });
    }
});


router.delete('/contact/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const contact = await Contact.findByIdAndDelete(id);

        if (!contact) {
            return res.status(404).json({ message: 'Contact not found' });
        }

        return res.status(200).json({ message: 'Contact deleted successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error deleting contact', error: error.message });
    }
});

// Add multiple users to an existing group
router.put('/addusertogroup/:id', async (req, res) => {
    try {
        const { users } = req.body;  // Expecting an array of user IDs
        
        const groupId = req.params.id;
        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        const existingUsersInGroup = new Set(group.userlist.map(userId => userId.toString()));

        for (let userId of users) {
            if (!existingUsersInGroup.has(userId)) {
                group.userlist.push(userId);

                const user = await User.findById(userId);
                if (!user) {
                    return res.status(404).json({ message: `User with ID ${userId} not found` });
                }

                if (!user.group.includes(groupId)) {
                    user.group.push(groupId);
                    await user.save();  
                }
            }
        }

        await group.save();

        res.status(200).json({ message: 'Users added to group successfully' });

    } catch (error) {
        console.error('Error adding users to group:', error);
        res.status(500).json({ message: 'Error adding users to group', error });
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

// Get all groups
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

// Get all groups of a user
router.get('/fetchpersonalgroups',fetchuser, async (req, res) => {
    try {

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const groups=user.group;
        if (!groups || groups.length === 0) {
            return res.status(201).json([]);
        }
        const groupdetail = [];
        for (const group of groups) { 
            groupdetail.push(await Group.findById(group));
        }

        res.status(200).json(groupdetail);
    } catch (error) {
        res.status(400).json({ message: 'Error fetching group', error });
    }
});

// Get all users in a group
router.get('/getalluserofgroup/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const groupdetail = await Group.findById(id);
        if (!groupdetail) {
            return res.status(404).json({ message: 'Group not found' });
        }
        const group=groupdetail.userlist;
        // console.log(group);

        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }
        const user = await User.find({}, { password: 0, group: 0 });
        const userlist = [];
        for (const grp of group) { 
            for (const usr of user) { 
                if (usr._id.toString() === grp.toString()) {
                    userlist.push(usr);
                    break;
                }
            }
        }
        // console.log("All uer of a group :",userlist);
        res.status(200).json(userlist);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching group', error: error.message });
    }
});

module.exports = router;
