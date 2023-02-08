const mongoose = require("mongoose")

// Product Schema
const Products = {
    ProductId: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        default: () => 1
    },
    ProductEstimatedPrice: {
        type: Number
    },
    ProductQuotedPrice: {
        type: Number
    },
    ProductIDToShow: {
        type: String,
        required: true
    },
    ProductName: {
        type: String,
        required: true
    },
}

const Updates = {
    EstimateToQuotation: {
        type: Date,
    },
    QuotationToPO: {
        type: Date,
    }
}

const Estimate = new mongoose.Schema({

    Products: [Products],

    DiscountPrice: Number,

    TotalCost: Number,

    EstimateNo: {
        type: Number
    },

    QuotationNo: {
        type: Number
    },

    PO_No: {
        type: Number
    },

    EstimateId: String,

    QuotationId: String,

    PO_Id: String,

    approvalFromAdminAsQuotes: {
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

    customerName: {
        type: String,
        required: true
    },

    agentName: {
        type: String,
        required: true
    },

    PurchaseInvoice: String,
    customerPhone:String,

    Status: {
        type: String,
        default: () => "PENDING"
    },
    Agent_Code: String,

    state: {
        type: String,
        required: true
    },

    GSTperc: {
        type: Number,
        default: () => 18
    }

});

module.exports = mongoose.model("Estimate", Estimate);
