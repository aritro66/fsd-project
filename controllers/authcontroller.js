const nodemailer = require('nodemailer');   // sending mail using node
const otpGenerator = require('otp-generator');  // generates otp
const bcrypt = require('bcryptjs');     // encrypting password
const jwt = require('jsonwebtoken');    // json web token
const creater = require('../models/users');
const otpcreater = require('../models/otps');
const forgotpasswordotpcreater = require('../models/forgotpasswordotps');

const loginget = (req, res) => {
    const chk = req.cookies.jwt;
    // getting cookie named jwt
    if (chk) {  // checking if jwt exists
        jwt.verify(chk, process.env.JWTKEY, function (err, decoded) {   // verifing token
            if (err) {
                res.render('login', { error: "" });     // if not logged in
                // no error
            }
            else {
                res.redirect('/home');  // if logged in
            }
        });
    }
    else {

        res.render('login', { error: "" }); // if not logged in, also no error
    }
}

const loginpost = async (req, res) => {
    console.log(req.body);
    try {
        const data2 = await creater.find({ email: req.body.email, allow: true }); // finding user by email
        console.log(data2);
        if (data2) {

            const result = await bcrypt.compareSync(req.body.password, data2[0].password); // checks if password is correct
            if (result) {
                const token2 = jwt.sign(`${data2[0]._id}`, process.env.JWTKEY); // creating token 
                res.cookie('jwt', token2); // adding token to cookie
                res.cookie('myaccount', JSON.stringify({ fname: data2[0].fname, lname: data2[0].lname, email: data2[0].email, phno: data2[0].phno }));   // cookie for account data
                res.redirect('/home');
            }
            else {
                res.render('login', { error: "Wrong password or Wrong user" });
            }
        }
        else {
            res.render('login', { error: "Wrong password or Wrong user" });
        }
    }
    catch (err) {
        console.log(err);
        res.render('login', { error: "Wrong password or Wrong user" });

    }
}

const forgotpassget = (req, res) => {
    const chk = req.cookies.jwt;
    // getting cookie named jwt
    if (chk) {  // checking if jwt exists
        jwt.verify(chk, process.env.JWTKEY, function (err, decoded) {   // verifing token
            if (err) {
                res.render('forgot');   // if not logged in

            }
            else {
                res.redirect('/home');  // if logged in
            }
        });
    }
    else {

        res.render('forgot');   // if not logged in
    }
}

const forgotpasspost = async (req, res) => {
    console.log(req.body);
    try {
        // transporter is going to be an object that is able to send mail
        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: `${process.env.AUTHUSER}`, // auth user gmail
                pass: `${process.env.AUTHPASSWORD}`, // auth user password
            },
        });
        const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });
        // generating otp of size 6 and having no upper case alphabets and special characters
        var mailOptions = {
            from: `${process.env.AUTHUSER}`,
            to: `${req.body.email}`,
            subject: 'Sending Email using Node.js',
            text: `your otp no is ${otp}`
        };

        let info = await transporter.sendMail(mailOptions);
        // sending otp by mail
        console.log("Message sent: %s", info.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        const now = new Date();
        const end = new Date(now.getTime() + 2 * 60 * 1000).getTime();
        const data = await forgotpasswordotpcreater.insertMany([{ otpno: otp, etime: end }]);
        res.json({ flag: "success" });

    } catch (error) {
        console.log(error);
    }

}

const forgotpassotp = async (req, res) => {
    console.log(req.body);
    try {
        const now = new Date().getTime();
        const checkotp = await forgotpasswordotpcreater.find({ otpno: req.body.otp })
        console.log(checkotp);
        if (checkotp) {
            if (parseInt(checkotp[0].etime) >= now) { // checking if otp is active
                res.json({ flag: "success" });
            }
            else {
                res.json({ flag: "fail" });
            }
        }

    } catch (error) {
        console.log(error);
    }

}

const changepass = async (req, res) => {
    console.log(req.body);
    try {
        var salt = bcrypt.genSaltSync(10); // generating salt
        // salt is a string of charcters different from password
        const pass = await bcrypt.hashSync(req.body.password, salt);
        // password is hashed using hashing algorithim and routerlying salt
        const result = await creater.updateOne({ email: req.body.email }, { $set: { password: pass } })
        // changing password
        console.log(result);
        res.json({ flag: "success" });

    } catch (error) {
        console.log(error);
    }
}

const signupotp = async (req, res) => {
    console.log(req.body);
    try {
        // transporter is going to be an object that is able to send mai
        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: `${process.env.AUTHUSER}`, // auth user gmail
                pass: `${process.env.AUTHPASSWORD}`, // auth user password
            },
        });
        const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });
        // generating otp of size 6 and having noupper case alphabets and special characters

        var mailOptions = {
            from: `${process.env.AUTHUSER}`,
            to: `${req.body.email}`,
            subject: 'Sending Email using Node.js',
            text: `your otp no is ${otp}`
        };

        let info = await transporter.sendMail(mailOptions);
        // sending otp by mail
        console.log("Message sent: %s", info.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        const now = new Date();
        const end = new Date(now.getTime() + 2 * 60 * 1000).getTime();
        const data = await otpcreater.insertMany([{ otpno: otp, etime: end }]);
        // res.redirect('/signup');

    } catch (error) {
        console.log(error);
    }
}

const signupget = (req, res) => {
    const chk = req.cookies.jwt;
    // getting cookie named jwt
    if (chk) {  // checking if jwt exists
        jwt.verify(chk, process.env.JWTKEY, function (err, decoded) {   // verifing token
            if (err) {
                res.render('signup', { passcheck: "", error: "" });     // if not logged in

            }
            else {
                res.redirect('/home');  // if logged in
            }
        });
    }
    else {

        res.render('signup', { passcheck: "", error: "" }); // if not logged in
    }
}

const signuppost = async (req, res) => {
    console.log(req.body);
    if (req.body.password1 == req.body.password2) { // checks if both password equal
        try {
            const now = new Date().getTime();   // getting current time in millisecond
            const checkotp = await otpcreater.find({ otpno: req.body.otp })
            console.log(checkotp);
            if (checkotp) {     // checking otp
                if (parseInt(checkotp[0].etime) >= now) { // checking if otp is active
                    console.log("working")
                    var salt = bcrypt.genSaltSync(10);  // generating salt
                    // salt is a string of charcters different from password
                    const pass = await bcrypt.hashSync(req.body.password1, salt);
                    // password is hashed using hashing algorithim and applying salt
                    const data = await creater.insertMany([{ fname: req.body.fname, lname: req.body.lname, email: req.body.email, phno: req.body.phno, password: pass }]);
                    const token = jwt.sign(`${data._id}`, process.env.JWTKEY); // creating token
                    res.cookie('jwt', token); // saving token in cookie jwt
                    res.cookie('myaccount', JSON.stringify({ fname: req.body.fname, lname: req.body.lname, email: req.body.email, phno: req.body.phno }));  // cookie for account data
                    res.redirect("/home");
                }

            }

        }
        catch (err) {
            console.log(err);
            res.render('signup', { passcheck: "", error: "Unable to sign up" });
        }
    }
    else {
        res.render('signup', { passcheck: "Password not matching...", error: "" });
    }

}

const logout = (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });   // jwt cookie expires in 1 milli second
    res.cookie('myaccount', '', { maxAge: 1 }); // myaccount cookie expires in 1 milli second
    res.redirect('/signup');
}

module.exports = { loginget, loginpost, forgotpassget, forgotpasspost, forgotpassotp, changepass, signupget, signuppost, signupotp, logout };