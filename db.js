const mongoose = require('mongoose');

const connectURI = 'mongodb://localhost:27017/inotebook';

const connectToMongo = () => {
    mongoose.connect(connectURI, () => {
        console.log("connected to mongo!");
    });

}

module.exports = connectToMongo;