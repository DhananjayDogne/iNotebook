const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const { body, validationResult } = require('express-validator');
const Contact = require('../models/Contact');

//Route 1 :Get all the contacts using: GET "/api/contacts/fetchallcontact". Login required
router.get('/fetchallcontact', fetchuser, async (req, res) => {
    try {
        const contacts = await Contact.find({ user: req.user.id });
        console.log(contacts);
        res.status(200).json(contacts)
    }
    catch (error) {
        console.log(error.message);
        return res.status(500).send("Internal Server Error");
    }

})

//Route 2 :Add a new contact using: POST "/api/contacts/addcontact". Login required
router.post('/addcontact', fetchuser, async (req, res) => {
    //Error check for input description
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, mobile, mother, father, address } = req.body;

        const contact = new Contact({
            name, email, mobile, mother, father, address, user: req.user.id
        })
        const savedcontact = await contact.save();
        res.status(200).json(savedcontact);
    }
    catch (error) {
        console.log(error.message);
        return res.status(500).send("Internal Server Error");
    }
})

//Route3
//Update an existing contact using: PUT "/api/contacts/updatecontact/:id". Login required
router.put('/updatecontact/:id', fetchuser, async (req, res) => { 
    const { name, email, mobile, mother, father, address } = req.body;
    try {
        const newContact = {};
        // Create a new contact object

        if (name) { newContact.name = name; }
        if (email) { newContact.email = email; }
        if (mobile) { newContact.mobile = mobile; }
        if (mother) { newContact.mother = mother; }
        if (father) { newContact.father = father; }
        if (address) { newContact.address = address; }

        let contact = await Contact.findById(req.params.id);
        if (!contact) { return res.status(404).send("Not Found"); }
        if (req.user.role === 'admin' || contact.user.toString() === req.user.id) {
            contact = await Contact.findByIdAndUpdate(req.params.id, { $set: newContact }, { new: true });
            res.status(200).send({ contact });
        } else {
            return res.status(401).send("Not Allowed");
        }
        
    } catch (error) {
        console.log(error.message);
        return res.status(500).send("Internal Server Error");
    }
})

//Route 4
//Delete a contact using: DELETE "/api/contacts/delete/:id" Login required
router.delete('/delete/:id', fetchuser, async (req, res) => {
    //find note to be delete
    try {
        let contact = await Contact.findById(req.params.id);
        if (!contact) { return res.status(404).send("Not Found"); }

        if (req.user.role === 'admin' || contact.user.toString() === req.user.id) {

            contact = await Contact.findByIdAndDelete(req.params.id);
            res.status(200).send({ "Success": "Notes Deleted Successfuly", contact: contact });
        }
        return res.status(401).send("Not Allowed");
    
    } catch (error) {
        console.log(error.message);
        return res.status(500).send("Internal Server Error");
    }
})

module.exports = router;