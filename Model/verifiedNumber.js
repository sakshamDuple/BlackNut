const mongoose = require("mongoose")

// Temple User Schema
const verifiedNumbers = new mongoose.Schema({
    number: {
        type: String,
        required:true
    },
    role:{
        type: String,
        required:true
    },
    id: {
        type: String,
        required:true
    },
    createdAt: {
        type:Date,
        default: () => Date.now()
    }
});

module.exports = mongoose.model("verifiedNumbers", verifiedNumbers);
