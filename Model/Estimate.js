const mongoose = require("mongoose")

// Temple User Schema
const Products = {
    type: String,
    required:true
}

const Estimate = new mongoose.Schema({

    ProductId: [Products],

    EstimateNo:{
        type: Number
    },

    quantiy: {
        type: String,
        required:true
    },

    approvalFromAdminAsQuotes: {
        type: Boolean,
        default: () => false
    },

    agentId: {
        type: String,
        required:true
    },

    customerId:{
        type:String,
        required:true
    },

    EstimateDateOfPurchase: {
        type:Date,
        default: () => Date.now() + 60*60*1000*24*5
    },

    createdAt: {
        type:Date,
        default: () => Date.now()
    }

});

module.exports = mongoose.model("Estimate", Estimate);
