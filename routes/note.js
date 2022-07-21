const express = require("express");
var fetchuser = require('../middleware/fetchuser');
const Note = require("../models/Note");
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { json } = require("express/lib/response");


router.get('/fetchallnotes',fetchuser, async (request, response) => {
    const notes = await  Note.find({user: request.user.id});
    response.json(notes);
});

router.post('/createNote',fetchuser,[
    body('name').isLength({ min: 3 }),
    body('description').isLength({min: 5}),
], 
async (req, res) => {
    const {name, description, tag} = req.body;
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        res.json(errors);
    }else{
        try {
            // saving data
            const note = new Note({
                name, description, tag, user: req.user.id
            });
    
            const savedNote = await note.save();

            res.json(note);
        } catch (error) {
            console.log(error.message);
            res.status(500).send("Some error occured");
        }
    }

    
});

router.put('/updateNote/:id',fetchuser, async (request, response) => {
    const {name, description, tag} = request.body;
    const newNote = {};
    try{
        if(name){newNote.name = name};
        if(description){newNote.description = description};
        if(tag){newNote.tag = tag};

        let note = await Note.findById(request.params.id);
        if(!note){return response.status(404).send("Not Found")}

        if(note.user.toString() !== request.user.id){
            return response.status(401).send("Not allowed");
        }

        note = await Note.findByIdAndUpdate(request.params.id, {$set: newNote},{new: true});
        response.json(note);
    }catch(error){
        response.status(500).send("Internal server error!");
    }
    
});

router.delete('/deleteNote/:id',fetchuser, async (request, response) => {

    try {
        let note = await Note.findById(request.params.id);
        if(!note){return response.status(404).send("Not Found");}

        if(note.user.toString() !== request.user.id){
            return response.status(401).send("Not allowed");
        }

        note = await Note.findByIdAndDelete(request.params.id);
        response.json({"Success": "Note has been deleted"});
    } catch (error) {
        console.log(error.message);
        return response.status(500).send("Some error occured");
    }

});

module.exports = router;