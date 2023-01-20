const mongoose = require("mongoose")
const crypto = require("crypto");

// User Schema
const productDetail = new mongoose.Schema({
    Capacity: {
        type: String,
        required: true
    },
    Model: {
        type: String,
        required: true
    },
    Price: {
        type: Number,
        required: true
    },
    Status: {
        type: String,
        default: () => "INACTIVE"
    },
    UnitId: {
        type: String
    },
    ProductID: {
        type: String,
        default: () => "PId" + Date.now().toString()
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