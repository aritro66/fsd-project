const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const nodemailer = require('nodemailer');
const otpGenerator = require('otp-generator');
const passwordGenerator = require('generate-password');
require('dotenv').config();


const PORT = process.env.PORT || 4000;
const link = `mongodb+srv://${process.env.PASSWORD}:mongodb2002@cluster0.8et7m.mongodb.net/${process.env.DATABASENAME}`;
mongoose.connect(`${link}`, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => { console.log("success"); app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); })
    .catch((err) => console.log(err));

const otpSchema = new mongoose.Schema({
    otpno: { type: String, require: true },
    etime: { type: String, require: true }
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
const forgotpasswordotpcreater = new mongoose.model("forgotpasswordotps", otpSchema);

app.use(express.static(__dirname+'/public'));
app.use(express.urlencoded({ extended: false }));
app.set('view engine', 'ejs');
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
                res.render('login');

            }
            else {
                res.redirect('/university');
            }
        });
    }
    else {

        res.render('login');
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
                res.render('forgot');

            }
            else {
                res.render('index');
            }
        });
    }
    else {

        res.render('forgot');
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
        const end = new Date(now.getTime() + 2 * 60 * 1000).getTime();
        const data = await forgotpasswordotpcreater.insertMany([{ otpno: otp, etime: end }]);
        res.json({ flag: "success" });

    } catch (error) {
        console.log(error);
    }


})

app.post('/forgotpasswordotp', async (req, res) => {
    console.log(req.body);
    try {
        const now = new Date().getTime();
        const checkotp = await forgotpasswordotpcreater.find({ otpno: req.body.otp })
        console.log(checkotp);
        if (checkotp) {
            if (parseInt(checkotp[0].etime) >= now) {
                res.json({ flag: "success" });
            }
            else {
                res.json({ flag: "fail" });
            }
        }

    } catch (error) {
        console.log(error);
    }


})

app.post('/changepassword', async (req, res) => {
    console.log(req.body);
    try {
        var salt = bcrypt.genSaltSync(10);
        const pass = await bcrypt.hashSync(req.body.password, salt);
        const result = await creater.updateOne({ email: req.body.email }, { $set: { password: pass } })
        console.log(result);
        res.json({ flag: "success" });

    } catch (error) {
        console.log(error);
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
                res.render('signup');

            }
            else {
                res.redirect('/university');
            }
        });
    }
    else {

        res.render('signup');
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
                if (parseInt(checkotp[0].etime) >= now) {
                    var salt = bcrypt.genSaltSync(10);
                    const pass = await bcrypt.hashSync(req.body.password1, salt);
                    const data = await creater.insertMany([{ fname: req.body.fname, lname: req.body.lname, email: req.body.email, password: pass }]);
                    const token = jwt.sign(`${data._id}`, 'hide');
                    res.cookie('jwt', token);
                    creater.deleteMany({ otpno: req.body.otp });
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
                res.render('index')
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