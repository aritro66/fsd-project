const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    otpno: { type: String, require: true },
    etime: { type: String, require: true }
});

const otpcreater = new mongoose.model("otps", otpSchema);

module.exports=otpcreater;