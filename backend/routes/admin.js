const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const checkadmin = require('../middleware/checkadmin');
const { body, validationResult } = require('express-validator');
const Contact = require('../models/Contact');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


//Route 1 :Get all the users using: GET "/api/admin/fetchalluser". Login required (admin)
router.get('/fetchalluser', fetchuser,checkadmin, async (req, res) => {
    try {
        const users = await User.find({});
        // console.log(users);
        res.json(users);
    }
    catch (error) {
        console.log(error.message);
        return res.status(500).send("Internal Server Error");
    }
})

//Route 2 :Get all the users using: GET "/api/admin/fetchcontact:id". Login required (admin)
router.get('/fetchcontact/:id', fetchuser, checkadmin, async (req, res) => {
    
    try {
        const id=req.params.id;
        const contactofUser = await Contact.find({ user: id });
        res.json(contactofUser);
    }
    catch (error) {
        console.log(error.message);
        return res.status(500).send("Internal Server Error");
    }
})



//Route3
//Update an existing User using: PUT "/api/admin/updateuser/:id". Login required
router.put('/updateuser/:id', fetchuser,checkadmin, async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const newUser = {};
        // Create a new contact object
        
        if (name) { newUser.name = name; }
        if (email) { newUser.email = email; }
        if (password) {
            let salt = await bcrypt.genSaltSync(10);
            const secPass = await bcrypt.hashSync(req.body.password, salt);
            newUser.password = secPass;
        }

        let user = await User.findById(req.params.id);
        if (!user) { return res.status(404).send("Not Found"); }
        
        user = await User.findByIdAndUpdate(req.params.id, { $set: newUser }, { new: true });
        res.send({ user });

    } catch (error) {
        console.log(error.message);
        return res.status(500).send("Internal Server Error");
    }
})

//Route 4
//Delete a contact using: DELETE "/api/admin/deleteuser/:id" Login required
router.delete('/deleteuser/:id', fetchuser, async (req, res) => {
    //find note to be delete
    try {
        let user = await User.findById(req.params.id);
        if (!user) { return res.status(404).send("Not Found"); }


        user = await User.findByIdAndDelete(req.params.id);
        res.send({ "Success": "Notes Deleted Successfuly", user: user });
        
        // return res.status(401).send("Not Allowed");

    } catch (error) {
        console.log(error.message);
        return res.status(500).send("Internal Server Error");
    }
})

module.exports = router;