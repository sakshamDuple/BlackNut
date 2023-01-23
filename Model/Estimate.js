const mongoose = require("mongoose")

// Temple User Schema
const Products = {
    ProductId:{
        type: String,
        required:true
    },
    quantity: {
        type: Number,
        default: () => 1
    },
}

const Estimate = new mongoose.Schema({

    Products: [Products],

    EstimateNo:{
        type: Number
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
