const mongoose = require("mongoose")
const crypto = require("crypto");
const { stringify } = require("querystring");

// User Schema
const Admin = new mongoose.Schema({

    firstName:{
        type: String,
        required: true
    },

    lastName:{
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },

    phone: {
        type:Number,
        required: true
    },

    role: {
        type:String,
        default: () => "role"
    },

    password: {
        type: String,
        required: true
    },

    loginTime: {
        type: [Date],
        default: () => [Date.now()]
    },

    logoutTime: {
        type: [Date],
        default: () => [Date.now()]
    },

    createdAt: {
        type: Date,
        default: () => Date.now()
    }

});

module.exports = mongoose.model("admin", Admin);
