const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true,
        trim: true
    },
    telefone: {
        type: String,
        required: true,
        trim: true
    }
}, { timestamps: true });

module.exports = mongoose.model("Lead", leadSchema);