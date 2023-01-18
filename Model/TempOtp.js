const mongoose = require("mongoose")

// Temple User Schema
const validOtp = new mongoose.Schema({
    number: {
        type: String,
        required:true
    },

    id: {
        type: String,
    },

    otp: {
        type: String,
    },
    createdAt: {
        type:Date,
        default: () => Date.now()
    }
});

validOtp.index( { createdAt: 1 }, { expireAfterSeconds: 600 } )

module.exports = mongoose.model("validOtp", validOtp);
