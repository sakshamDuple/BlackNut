const mongoose = require("mongoose")

const Notification = new mongoose.Schema({

    notificationNumber: Number,

    notification: {
        type: String,
        required: true
    },

    navigation: String,

    read: {
        type: Boolean,
        default : () => false
    },

    userType: String,

    createdAt: {
        type: Date,
        default: () => Date.now()
    }

});

module.exports = mongoose.model("Notification", Notification);