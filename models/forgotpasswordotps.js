const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    otpno: { type: String, require: true },
    etime: { type: String, require: true }
});

const forgotpasswordotpcreater = new mongoose.model("forgotpasswordotps", otpSchema);

module.exports=forgotpasswordotpcreater;