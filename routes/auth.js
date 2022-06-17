const express = require("express");

const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const { json } = require("express/lib/response");

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
                password: req.body.password,
            }).then(user => res.json(user)).catch(err => res.json({error: res.error}));
        } catch (error) {
            console.log(error.message);
            res.status(500).send("Some error occured");
        }
    });

module.exports = router