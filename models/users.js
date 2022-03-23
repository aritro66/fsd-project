const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fname: { type: String, require: true },
    lname: { type: String, require: true },
    email: { type: String, require: true, unique: true },
    phno: { type: String, require: true },
    password: { type: String, require: true }
});

const creater = new mongoose.model("users", userSchema);

module.exports=creater;