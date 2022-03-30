const mongoose = require('mongoose');
// defining schema
const otpSchema = new mongoose.Schema({
    otpno: { type: String, require: true },
    etime: { type: String, require: true }
});
// creating model
const forgotpasswordotpcreater = new mongoose.model("forgotpasswordotps", otpSchema);

module.exports=forgotpasswordotpcreater;