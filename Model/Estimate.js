const mongoose = require("mongoose")

// Temple User Schema
const Products = {
    ProductId: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        default: () => 1
    },
}

const Updates = {
    EstimateToQuotation: {
        type: Date,
    },
    QuotationToPI: {
        type: Date,
    },
    PI_To_Po: {
        type: Date,
    },
}

const Estimate = new mongoose.Schema({

    Products: [Products],

    EstimateNo: {
        type: Number
    },

    QuotationNo: {
        type: Number
    },

    PI_No: {
        type: Number
    },

    PO_No: {
        type: Number
    },

    EstimateId: {
        type: String,
    },

    QuotationId: {
        type: String,
    },

    PI_Id: {
        type: String,
    },

    PO_Id: {
        type: String,
    },

    approvalFromAdminAsQuotes: {
        type: Boolean,
        default: () => false
    },

    approvalFromAdminAsPI: {
        type: Boolean,
        default: () => false
    },

    approvalFromAdminAsPO: {
        type: Boolean,
        default: () => false
    },

    agentId: {
        type: String,
        required: true
    },

    customerId: {
        type: String,
        required: true
    },

    EstimateDateOfPurchase: {
        type: Date,
        default: () => Date.now() + 60 * 60 * 1000 * 24 * 5
    },

    createdAt: {
        type: Date,
        default: () => Date.now()
    },

    Updates: Updates,

});

module.exports = mongoose.model("Estimate", Estimate);
