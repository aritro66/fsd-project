const mongoose = require('mongoose');

const diseaseSchema = new mongoose.Schema({
    name: { type: String },
    image: { type: String },
    symptoms: { type: String },
    cure: { type: String }
});

const diseasecreater = new mongoose.model("diseases", diseaseSchema);

module.exports = diseasecreater;