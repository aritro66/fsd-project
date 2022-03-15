const express = require('express');
const app = express();
const mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var cookieParser = require('cookie-parser');
var nodemailer = require('nodemailer');
const otpGenerator = require('otp-generator');
require('dotenv').config();


const PORT = process.env.PORT || 4000;
const link = `mongodb+srv://${process.env.PASSWORD}:mongodb2002@cluster0.8et7m.mongodb.net/${process.env.DATABASENAME}`;
mongoose.connect(`${link}`, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => { console.log("success"); app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); })
    .catch((err) => console.log(err));

const otpSchema = new mongoose.Schema({
    otpno: { type: String, require: true },
    etime: { type: String, required: true }
});

const userSchema = new mongoose.Schema({
    fname: { type: String, require: true },
    lname: { type: String, require: true },
    email: { type: String, require: true, unique: true },
    phno: { type: String, require: true },
    password: { type: String, require: true }
});

const creater = new mongoose.model("users", userSchema);
const otpcreater = new mongoose.model("otps", otpSchema);

app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: false }))
app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
    const chk = req.cookies.jwt;
    if (chk) {
        jwt.verify(chk, 'hide', function (err, decoded) {
            if (err) {
                res.redirect('/signup');
            }
            else {
                res.redirect('/university');
            }
        });
    }
    else {

        res.redirect('/signup');
    }
});

app.get('/login', (req, res) => {
    const chk = req.cookies.jwt;
    if (chk) {
        jwt.verify(chk, 'hide', function (err, decoded) {
            if (err) {
                res.sendFile(__dirname + '/login.html');

            }
            else {
                res.redirect('/university');
            }
        });
    }
    else {

        res.sendFile(__dirname + '/login.html');
    }
});

app.post("/login", async (req, res) => {
    console.log(req.body);
    try {
        const data2 = await creater.find({ name: req.body.email });
        console.log(data2);
        if (data2) {

            const result = await bcrypt.compareSync(req.body.password, data2[0].password);
            if (result) {
                const token2 = jwt.sign(`${data2[0]._id}`, 'hide');
                res.cookie('jwt', token2);
                res.redirect('/university');

            }
            else {
                res.send('wrong password');

            }
        }
        else {
            res.send('wrong email');
        }
    }
    catch (err) {
        console.log(err);
        res.send("could\'nt log in");
    }
})

app.get('/forgotpassword', (req, res) => {
    const chk = req.cookies.jwt;
    if (chk) {
        jwt.verify(chk, 'hide', function (err, decoded) {
            if (err) {
                res.sendFile(__dirname + '/forgot.html');

            }
            else {
                res.sendFile(__dirname + '/index.html');
            }
        });
    }
    else {

        res.sendFile(__dirname + '/forgot.html');
    }
});

app.post('/forgotpassword', async (req, res) => {
    console.log(req.body);
    try {
        let transporter = nodemailer.createTransport({
            service: "gmail", // true for 465, false for other ports
            auth: {
                user: `${process.env.AUTHUSER}`, // generated ethereal user
                pass: `${process.env.AUTHPASSWORD}`, // generated ethereal password
            },
        });

        var mailOptions = {
            from: 'ghosharitro007@gmail.com',
            to: `${req.body.email}`,
            subject: 'Sending Email using Node.js',
            text: 'That was easy!'
        };

        let info = await transporter.sendMail(mailOptions);
        console.log("Message sent: %s", info.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        res.redirect('/signup');
    } catch (error) {
        res.redirect('/forgotpassword');
    }


})

app.post('/otp', async (req, res) => {
    console.log(req.body);
    try {
        let transporter = nodemailer.createTransport({
            service: "gmail", // true for 465, false for other ports
            auth: {
                user: `${process.env.AUTHUSER}`, // generated ethereal user
                pass: `${process.env.AUTHPASSWORD}`, // generated ethereal password
            },
        });
        const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });
        var mailOptions = {
            from: `${process.env.AUTHUSER}`,
            to: `${req.body.email}`,
            subject: 'Sending Email using Node.js',
            text: `your otp no is ${otp}`
        };

        let info = await transporter.sendMail(mailOptions);
        console.log("Message sent: %s", info.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        const now = new Date();
        const end = new Date(now.getTime() + 5 * 60 * 1000).getTime();
        const data = await otpcreater.insertMany([{ otpno: otp, etime: end }]);
        // res.redirect('/signup');

    } catch (error) {
        console.log(error);
    }


})

app.get('/signup', (req, res) => {
    const chk = req.cookies.jwt;
    if (chk) {
        jwt.verify(chk, 'hide', function (err, decoded) {
            if (err) {
                res.sendFile(__dirname + '/signup.html');

            }
            else {
                res.redirect('/university');
            }
        });
    }
    else {

        res.sendFile(__dirname + '/signup.html');
    }
});

app.post('/signup', async (req, res) => {
    console.log(req.body);
    if (req.body.password1 == req.body.password2) {
        try {
            const now = new Date().getTime();
            const checkotp = await otpcreater.find({ otpno: req.body.otp })
            console.log(checkotp);
            if (checkotp) {
                if(parseInt(checkotp[0].etime)>=now)
                {
                    var salt = bcrypt.genSaltSync(10);
                const pass = await bcrypt.hashSync(req.body.password1, salt);
                const data = await creater.insertMany([{ fname: req.body.fname, lname: req.body.lname, email: req.body.email, password: pass }]);
                const token = jwt.sign(`${data._id}`, 'hide');
                res.cookie('jwt', token);
                res.redirect("/university");
                }
                
            }

        }
        catch (err) {
            console.log(err);
            res.send("could\'nt sign up");
        }
    }
    else {
        res.send("Password not matching...");
    }

})

app.get('/university', (req, res) => {
    const chk = req.cookies.jwt;
    if (chk) {
        jwt.verify(chk, 'hide', function (err, decoded) {
            if (err) {
                res.redirect('/signup');

            }
            else {
                res.sendFile(__dirname + '/index.html')
            }
        });
    }
    else {
        res.redirect('/signup');
    }
});

app.get('/logout', (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.redirect('/signup');
})