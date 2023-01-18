const mongoose = require("mongoose")
const crypto = require("crypto");

// User Schema
const Admin = new mongoose.Schema({

    email: {
        type: String,
        required: true
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
