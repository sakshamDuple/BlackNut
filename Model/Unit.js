const mongoose = require("mongoose")

// User Schema
const UnitManage = new mongoose.Schema({

    field: {
        type: String,
        required: true
    },

    Unit: {
        type: String,
        required: true
    },

    createdAt: {
        type: Date,
        default: () => Date.now()
    }

});

module.exports = mongoose.model("UnitManage", UnitManage);