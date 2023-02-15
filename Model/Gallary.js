const mongoose = require("mongoose")

const Gallary = new mongoose.Schema({

    Title: {
        type: String,
        required: true
    },

    Content: {
        type: String,
        required: true
    },

    createdAt: {
        type: Date,
        default: () => Date.now()
    }

});

module.exports = mongoose.model("Gallary", Gallary);