const jwt = require('jsonwebtoken');
const creater = require('../models/users');

const admin = async (req, res) => {
    const data = await creater.find({ email: { $ne: "ghosharitro66@gmail.com" } }); // finding user by email
    const chk = req.cookies.jwt;
    if (chk) {  // checking if jwt exists
        jwt.verify(chk, process.env.JWTKEY, function (err, decoded) {   // verifing token
            if (err) {
                res.redirect('/signup');    // if not logged in

            }
            else {
                if (req.cookies.myaccount) {
                    if (JSON.parse(req.cookies.myaccount).email === "ghosharitro66@gmail.com") {
                        res.render('admin', { data: data });
                    }
                    else {
                        res.redirect('/home')
                    }
                }
                else {
                    res.redirect('/home')
                }
            }
        });
    }
    else {
        res.redirect('/signup');    // if not logged in
    }
}

const block = async (req, res, next) => {
    console.log(req.body);
    const result = await creater.updateOne({ _id: req.body.productid }, { $set: { allow: false } })
    console.log(result);
    next();
}

const unblock = async (req, res, next) => {
    console.log(req.body);
    const result = await creater.updateOne({ _id: req.body.productid }, { $set: { allow: true } })
    console.log(result);
    next();
}

module.exports = { admin, block, unblock };