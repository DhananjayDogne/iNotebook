const express = require('express');
const router = express.Router();
const {body ,validationResult} = require('express-validator');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');

const JWT_SECRET = "dddd";
//Route 1 Create a User using: POST "/api/auth/". Doesn't require Auth
router.post('/createUser', [
    body('name','Enter a valid name').isLength({ min: 3 }),
    body('email','Enter a valid email').isEmail(),
    body('password','Password must be atleast 5 charcters').isLength({ min: 5 }),
], async (req, res) => {
    //if there are errors return bad request and the errors
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
       
        return res.status(400).json({ success: success, errors: errors.array() });
    }

    //Check if user is alreDY exists 
    try {
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ success: success, error: "Sorry this user is already exist" });
        }
        
        //create a salt to hash password
        let salt = await bcrypt.genSaltSync(10);
        const secPass = await bcrypt.hashSync(req.body.password, salt);
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass,
            role: 'user',
            group: [],
            groupperminsion: [], 
        });

        //Creating a token for authentication
        const data = {
            user: {
                id: user.id,
                role:user.role
            }
        }
       
        const authtoken = jwt.sign(data, JWT_SECRET);
        success = true;
        res.status(200).send({ name: user.name, token: authtoken ,role:user.role});
    }
    catch (error) {
        console.log(error.message);
        return res.status(500).send({ success: false, error:"Some error occured"});
    }
  
    
})

//Route 2 Authenticate a User using: POST "/api/auth/login". No login required
router.post('/login', [
  
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password can not be empty').exists(),
], async (req, res) => { 
    const errors = validationResult(req);
    let success=false;
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: success, errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
        let user =await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: success, error: "Please try to login with correct credentials" });
        }
        const passwordCompare =await bcrypt.compare(password, user.password);
        if(!passwordCompare){
            return res.status(400).json({ success: success, error: "Please try to login with correct credentials" });
        }
        const data = {
            user: {
                id: user.id,
                role:user.role
            }
        }
        const authtoken = jwt.sign(data, JWT_SECRET);
        success = true;
        res.status(200).send({ name: user.name , token:authtoken ,role:user.role});
    }
    catch (error) { 
        console.log(error.message);
        return res.status(500).send({ success: false, error: "Internal Server Error" });
    }
})



//Router3 Get loggedin User Details using: POST "/api/auth/getuser". Login required
router.get('/getuser',fetchuser, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        res.status(200).send({user});
    }
    catch (error) {
        console.log(error.message);
        return res.status(500).send("Internal Server Error");
    }
})


module.exports = router;