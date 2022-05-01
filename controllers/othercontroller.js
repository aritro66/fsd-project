const jwt = require('jsonwebtoken');    // json web token
const productcreater = require("../models/products");
const ordercreater = require("../models/order");


const landing = (req, res) => {
    const chk = req.cookies.jwt;
    // getting cookie named jwt
    if (chk) {  // checking if jwt exists
        jwt.verify(chk, process.env.JWTKEY, function (err, decoded) {   // verifing token
            if (err) {
                res.render('landing');  // if not logged in
            }
            else {
                res.redirect('/home');  // if logged in
            }
        });
    }
    else {

        res.render('landing');  // if not logged in
    }
}

const home = async (req, res) => {
    const chk = req.cookies.jwt;
    // getting cookie named jwt
    const productlist = await productcreater.find();
    // console.log(productlist)
    if (chk) {  // checking if jwt exists
        jwt.verify(chk, process.env.JWTKEY, function (err, decoded) {   // verifing token
            if (err) {
                res.redirect('/signup');    // if not logged in

            }
            else {
                if (req.cookies.cart) {
                    console.log(req.cookies.cart)
                    res.render('home', { productdata: productlist, cartlength: JSON.parse(req.cookies.cart).length })      // if logged in
                }
                else {
                    res.render('home', { productdata: productlist, cartlength: 0 })
                }
            }
        });
    }
    else {
        res.redirect('/signup');    // if not logged in
    }
}

const myaccount = (req, res) => {
    const chk = req.cookies.jwt;
    // getting cookie named jwt
    if (chk) {  // checking if jwt exists
        jwt.verify(chk, process.env.JWTKEY, function (err, decoded) {   // verifing token
            if (err) {
                res.redirect('/signup');  // if not logged in
            }
            else {
                const info = JSON.parse(req.cookies.myaccount);
                console.log(req.cookies.myaccount);
                console.log({ fname: info.fname, lname: info.lname, email: info.email, phno: info.phno });
                // { fname: req.body.fname, lname: req.body.lname, email: req.body.email, phno: req.body.phno, password: pass }
                res.render('myaccount', { fname: info.fname, lname: info.lname, email: info.email, phno: info.phno });  // if logged in
            }
        });
    }
    else {
        res.redirect('/signup');     // if not logged in
    }
}

const doctor = (req, res) => {
    const chk = req.cookies.jwt;
    // getting cookie named jwt
    if (chk) {  // checking if jwt exists
        jwt.verify(chk, process.env.JWTKEY, function (err, decoded) {   // verifing token
            if (err) {
                res.redirect('/signup');    // if not logged in

            }
            else {
                res.render("docnew");   // if logged in
            }
        });
    }
    else {
        res.redirect('/signup');    // if not logged in
    }
}

const about = (req, res) => {
    const chk = req.cookies.jwt;
    // getting cookie named jwt
    if (chk) {  // checking if jwt exists
        jwt.verify(chk, process.env.JWTKEY, function (err, decoded) {   // verifing token
            if (err) {
                res.redirect('/signup');    // if not logged in

            }
            else {
                res.render('about');    // if logged in
            }
        });
    }
    else {
        res.redirect('/signup');    // if not logged in
    }
}

const myorder = async (req, res) => {
    const data = await ordercreater.find({ email: JSON.parse(req.cookies.myaccount).email }); // finding user by email
    console.log(data);
    res.render('myorder', { data, data });
}

module.exports = { landing, home, myaccount, doctor, about, myorder };
