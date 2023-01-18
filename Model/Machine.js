const mongoose = require("mongoose")

const Machine = {
    Machine_name: {
        type: String,
        required: true
    },
    Product_name: {
        type: String,
        required: true
    },
    cropId: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: () => Date.now()
    }
}

module.exports = mongoose.model("Machine", Machine);