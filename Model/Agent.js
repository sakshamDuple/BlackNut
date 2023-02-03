const mongoose = require("mongoose")
const crypto = require("crypto");

// User Schema
const Address = {
    city: {
        type: String,
        required: true
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
        required: true
    },
}

const Agent = new mongoose.Schema({
    role: {
        type: String,
        default: () => "user"
    },

    AgentNo: {
        type: Number
    },

    AgentID: {
        type: String
    },

    CustomerID: {
        type: String
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

    status: {
        type: String,
        default: () => "PENDING"
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
    PAN_Company_File: String,
    PAN_Agent: String,
    PAN_Agent_File: String,
    Address: Address,
    DocumentFile: String

});

Agent.methods.generatePasswordReset = function () {
    this.resetPasswordToken = crypto.randomBytes(20).toString('hex');
    this.resetPasswordExpires = Date.now() + 3600000; // Expires in an hour
};

module.exports = mongoose.model("Agent", Agent);
