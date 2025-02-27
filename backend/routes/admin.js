const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const checkadmin = require('../middleware/checkadmin');
const { body, validationResult } = require('express-validator');
const Contact = require('../models/Contact');
const User = require('../models/User');


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


//Route 3 :Add a new Uer using: POST "/api/contacts/addcontact". Login required
// router.post('/adduser', fetchuser, [
//     body('name', 'Please add minimum 3 character title').isLength({ min: 3 }),
//     body('mobile', 'Please add description atleat 5 characters').isLength({ min: 10 }),
// ], async (req, res) => {
//     //Error check for input description
//     try {
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             return res.status(400).json({ errors: errors.array() });
//         }

//         const { name, email, mobile, mother, father, address } = req.body;

//         const contact = new User({
//             name, email, mobile, mother, father, address, user: req.user.id
//         })
//         const savedcontact = await contact.save();
//         res.json(savedcontact);
//     }
//     catch (error) {
//         console.log(error.message);
//         return res.status(500).send("Internal Server Error");
//     }
// })

//Route3
//Update an existing User using: PUT "/api/contacts/updateuser/:id". Login required
router.put('/updateuser/:id', fetchuser,checkadmin, async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const newUser = {};
        // Create a new contact object
        let salt = await bcrypt.genSaltSync(10);
        const secPass = await bcrypt.hashSync(req.body.password, salt);
        if (name) { newUser.name = name; }
        if (email) { newUser.email = email; }
        if (password) { newUser.password = password; }

        let user = await User.findById(req.params.id);
        if (!user) { return res.status(404).send("Not Found"); }
        if (req.user.role === 'admin' || user.user.toString() === req.user.id) {
            user = await User.findByIdAndUpdate(req.params.id, { $set: newUser }, { new: true });
            res.send({ user });
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

        //checking for user is owner
        if (req.user.role === 'admin' || contact.user.toString() === req.user.id) {

            contact = await Contact.findByIdAndDelete(req.params.id);
            res.send({ "Success": "Notes Deleted Successfuly", contact: contact });
        }
        return res.status(401).send("Not Allowed");

    } catch (error) {
        console.log(error.message);
        return res.status(500).send("Internal Server Error");
    }
})

module.exports = router;