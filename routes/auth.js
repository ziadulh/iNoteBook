const express = require("express");

const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const { json } = require("express/lib/response");
const bcrypt = require('bcryptjs');

var jwt = require('jsonwebtoken');
const JWT_Secret = 'thsi@isavrey$sceret';

const router = express.Router();

router.post('/createUser',[
        body('name').isLength({ min: 3 }),
         // username must be an email
        body('email').isEmail(),
        // password must be at least 5 chars long
        body('password').isLength({ min: 5 }),

    ], 
    async (req, res) => {
        const errors = validationResult(req);

        const salt = await bcrypt.genSalt(10);
        securePass = await bcrypt.hash(req.body.password, salt);

        //check for existing email
        let user = await User.findOne({email: req.body.email});
        if(user){
            return res.status(400).json({error: "This email has already been taken"});
        }

        // checking validation
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // saving data
        try {
            user = await User.create({
                name: req.body.name,
                email: req.body.email,
                password: securePass,
            });

            const data = {
                user: {
                    id: user.id
                }
            }

            const authToken = jwt.sign(data, JWT_Secret)
            res.json({authToken});
        } catch (error) {
            console.log(error.message);
            res.status(500).send("Some error occured");
        }
    });

    router.post('/login',[
        body('email', 'Enter a valid email').isEmail(),
        body('password', 'password can\'t be empty').exists()
        ],
        async (req, res) => {

            const errors = validationResult(req);
            if(!errors.isEmpty()){
                return res.status(400).json({errors: errors.array()});
            }

            const {email, password} = req.body;
            try {
                let user = await User.findOne({email});
                if(!user){
                    return res.status(400).json({error: "Please login with correct credentials."});
                }

                const passwordCompare = await bcrypt.compare(password, user.password);
                if(!passwordCompare){
                    return res.status(400).json({error: "Please login with correct credentials."});
                }

                const data = {
                    user: {
                        id: user.id
                    }
                }

                const authToken = jwt.sign(data, JWT_Secret)
                res.json({authToken});

            } catch (error) {
                res.status(500).send("Internal server error");
            }
        }
    );

module.exports = router