const mongoose = require("mongoose")

const Crop = new mongoose.Schema({

    crop: {
        type: String,
        required: true
    },

    createdAt: {
        type: Date,
        default: () => Date.now()
    }

});

module.exports = mongoose.model("Crop", Crop);