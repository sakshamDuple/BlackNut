const mongoose = require("mongoose")
const crypto = require("crypto");

// User Schema
const productDetail = {
    Capacity: {
        type: Number,
    },
    Model: {
        type: String,
    },
    Price: {
        type: Number,
    },
    Status: {
        type: String,
        default: () => "INACTIVE"
    },
    UnitId: {
        type: String,
        required: true
    },
    ProductID: {
        type: String,
        default: () => "PId" + Date.now().toString()
    },
    createdAt: {
        type: Date,
        default: () => Date.now()
    }
}

const machines = {
    Machine_name: {
        type: String,
        required: true
    },
    productDetail: [productDetail]
}

const products = {
    Product_name: {
        type: String,
        required: true
    },
    machines: [machines]
}

const Agent = new mongoose.Schema({

    crop: {
        type: String,
        required: true
    },

    products: [products],

    createdAt: {
        type: Date,
        default: () => Date.now()
    }

});

module.exports = mongoose.model("Product", Agent);