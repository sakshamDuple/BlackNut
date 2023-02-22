const mongoose = require("mongoose")
const crypto = require("crypto");
const { stringify } = require("querystring");

// User Schema
const Address = {
    city: {
        type: String,
    },
    state: {
        type: String,
        required: true
    },
    mainAddressText: {
        type: String,
        required: true
    },
    pincode: {
        type: Number,
    },
}

const Admin = new mongoose.Schema({

    firstName:{
        type: String,
        required: true
    },

    lastName:{
        type: String,
        required: true
    },

    fullName: String,

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
        default: () => "admin"
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

    Address: Address,

    createdAt: {
        type: Date,
        default: () => Date.now()
    }

});

module.exports = mongoose.model("admin", Admin);
