const mongoose = require("mongoose");

const siteContentSchema = new mongoose.Schema({
    key: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    value: {
        type: String,
        default: ""
    }
}, { timestamps: true });

module.exports = mongoose.model("SiteContent", siteContentSchema);