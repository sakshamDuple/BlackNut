const mongoose = require("mongoose")
const crypto = require("crypto");

// User Schema
const Address = {
    city: String,
    state: String,
    mainAddressText: String,
    pincode: Number,
}

const Agent = new mongoose.Schema({
    role: {
        type: String,
        default: () => "user"
    },

    firstName: {
        type: String,
        required: true
    },

    lastName: {
        type: String,
        required: true
    },

    phone: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    },

    // resetPasswordToken: {
    //     type: String,
    //     required: false
    // },

    // resetPasswordExpires: {
    //     type: Date,
    //     required: false
    // },

    status: {
        type: String,
        default: () => "ACTIVE"
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
    },

    Company_Name: String,
    GST_Number: String,
    PAN_Company: String,
    PAN_Agent: String,
    Address: Address
});

Agent.methods.generatePasswordReset = function () {
    this.resetPasswordToken = crypto.randomBytes(20).toString('hex');
    this.resetPasswordExpires = Date.now() + 3600000; // Expires in an hour
};

module.exports = mongoose.model("Agent", Agent);
