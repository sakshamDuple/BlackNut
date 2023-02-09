const mongoose = require("mongoose")
const crypto = require("crypto");

// User Schema
const productDetail = new mongoose.Schema({
    Capacity: {
        type: String,
        required: true
    },
    Model: {
        type: String
    },
    Price: {
        type: Number,
        required: true
    },
    Status: {
        type: String,
        default: () => "INACTIVE"
    },
    Gst: {
        type: Number,
        required: true
    },
    UnitId: {
        type: String
    },
    ProductID: {
        type: String,
        default: () => "PId" + Date.now()
    },
    createdAt: {
        type: Date,
        default: () => Date.now()
    },
    cropId: { 
        type: String,
        required:true
    },
    machineId: {
        type: String,
        required:true
    },
    updateAt: {
        type: Date,
        default: () => Date.now()
    }
})

module.exports = mongoose.model("Product", productDetail);