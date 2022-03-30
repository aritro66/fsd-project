const mongoose = require('mongoose');
// defining schema
const userSchema = new mongoose.Schema({
    fname: { type: String, require: true },
    lname: { type: String, require: true },
    email: { type: String, require: true, unique: true },
    phno: { type: String, require: true },
    password: { type: String, require: true }
});
// creating model
const creater = new mongoose.model("users", userSchema);

module.exports=creater;