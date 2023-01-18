const mongoose = require("mongoose")

// Temple User Schema
const Estimate = new mongoose.Schema({

    ProductId: {
        type: String,
        required:true
    },

    quantiy: {
        type: String,
        required:true
    },

    approvalFromAdmin: {
        type: Boolean,
        default: () => false
    },

    agentId: {
        type: String,
        required:true
    },

    createdAt: {
        type:Date,
        default: () => Date.now()
    }

});

module.exports = mongoose.model("Estimate", Estimate);
