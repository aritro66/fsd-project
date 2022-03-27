const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const nodemailer = require('nodemailer');
const otpGenerator = require('otp-generator');
const creater = require('./models/users');
const otpcreater = require('./models/otps');
const diseasecreater = require('./models/diseases');
const forgotpasswordotpcreater = require('./models/forgotpasswordotps');

const passwordGenerator = require('generate-password');
require('dotenv').config();


const PORT = process.env.PORT || 4000;
const link = `mongodb+srv://${process.env.PASSWORD}:mongodb2002@cluster0.8et7m.mongodb.net/${process.env.DATABASENAME}`;
mongoose.connect(`${link}`, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => { console.log("success"); app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); })
    .catch((err) => console.log(err));

app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: false }));
app.set('view engine', 'ejs');
app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
    const chk = req.cookies.jwt;
    if (chk) {
        jwt.verify(chk, process.env.JWTKEY, function (err, decoded) {
            if (err) {
                res.render('landing');
            }
            else {
                res.redirect('/home');
            }
        });
    }
    else {

        res.render('landing');
    }
});

app.get('/login', (req, res) => {
    const chk = req.cookies.jwt;
    if (chk) {
        jwt.verify(chk, process.env.JWTKEY, function (err, decoded) {
            if (err) {
                res.render('login', { error: "" });

            }
            else {
                res.redirect('/home');
            }
        });
    }
    else {

        res.render('login', { error: "" });
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
                const token2 = jwt.sign(`${data2[0]._id}`, process.env.JWTKEY);
                res.cookie('jwt', token2);
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
        res.send("could\'nt log in");
    }
})

app.get('/forgotpassword', (req, res) => {
    const chk = req.cookies.jwt;
    if (chk) {
        jwt.verify(chk, process.env.JWTKEY, function (err, decoded) {
            if (err) {
                res.render('forgot');

            }
            else {
                res.redirect('/home');
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
        const end = new Date(now.getTime() + 2 * 60 * 1000).getTime();
        const data = await otpcreater.insertMany([{ otpno: otp, etime: end }]);
        // res.redirect('/signup');

    } catch (error) {
        console.log(error);
    }


})

app.get('/signup', (req, res) => {
    const chk = req.cookies.jwt;
    if (chk) {
        jwt.verify(chk, process.env.JWTKEY, function (err, decoded) {
            if (err) {
                res.render('signup', { passcheck: "", error: "" });

            }
            else {
                res.redirect('/home');
            }
        });
    }
    else {

        res.render('signup', { passcheck: "", error: "" });
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
                    const data = await creater.insertMany([{ fname: req.body.fname, lname: req.body.lname, email: req.body.email, phno: req.body.phno, password: pass }]);
                    const token = jwt.sign(`${data._id}`, process.env.JWTKEY);
                    res.cookie('jwt', token);
                    res.cookie('myaccount', JSON.stringify({ fname: req.body.fname, lname: req.body.lname, email: req.body.email, phno: req.body.phno, password: pass }));
                    creater.deleteMany({ otpno: req.body.otp });
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

})

// app.get('/home', (req, res) => {
//     const chk = req.cookies.jwt;
//     if (chk) {
//         jwt.verify(chk, process.env.JWTKEY, function (err, decoded) {
//             if (err) {
//                 res.redirect('/signup');

//             }
//             else {
//                 res.render('home')
//             }
//         });
//     }
//     else {
//         res.redirect('/signup');
//     }
// });

app.get('/home',(req,res)=>{
    res.render('home');
})

app.get('/logout', (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.cookie('myaccount', '', { maxAge: 1 });
    res.redirect('/signup');
})

app.get('/myaccount', (req, res) => {
    const chk = req.cookies.jwt;
    if (chk) {
        jwt.verify(chk, process.env.JWTKEY, function (err, decoded) {
            if (err) {
                res.redirect('/signup');

            }
            else {
                const info = JSON.parse(req.cookies.myaccount);
                console.log(req.cookies.myaccount);
                console.log({ fname: info.fname, lname: info.lname, email: info.email, phno: info.phno });
                // { fname: req.body.fname, lname: req.body.lname, email: req.body.email, phno: req.body.phno, password: pass }
                res.render('myaccount', { fname: info.fname, lname: info.lname, email: info.email, phno: info.phno });
            }
        });
    }
    else {
        res.redirect('/signup');
    }

})

app.get('/products', (req, res) => {
    const chk = req.cookies.jwt;
    if (chk) {
        jwt.verify(chk, process.env.JWTKEY, function (err, decoded) {
            if (err) {
                res.redirect('/signup');

            }
            else {
                res.render('allproducts');
            }
        });
    }
    else {
        res.redirect('/signup');
    }
})

app.get('/singleproducts', (req, res) => {
    const chk = req.cookies.jwt;
    if (chk) {
        jwt.verify(chk, process.env.JWTKEY, function (err, decoded) {
            if (err) {
                res.redirect('/signup');

            }
            else {
                res.render('sproducts');
            }
        });
    }
    else {
        res.redirect('/signup');
    }

})

app.get('/diseases', async (req, res) => {
    const chk = req.cookies.jwt;
    const diseaselist = await diseasecreater.find();
    if (chk) {
        jwt.verify(chk, process.env.JWTKEY, function (err, decoded) {
            if (err) {
                res.redirect('/signup');

            }
            else {
                res.render("diseases", { diseaseslist: diseaselist });
            }
        });
    }
    else {
        res.redirect('/signup');
    }

})

app.get('/disease/:id', async (req, res) => {
    const chk = req.cookies.jwt;
    const singleDisease = await diseasecreater.find({ _id: req.params.id });
    if (chk) {
        jwt.verify(chk, process.env.JWTKEY, function (err, decoded) {
            if (err) {
                res.redirect('/signup');

            }
            else {
                console.log(singleDisease);
                res.render("diseases2", { disease: singleDisease[0] });
            }
        });
    }
    else {
        res.redirect('/signup');
    }

})

app.get('/doctor', (req, res) => {
    const chk = req.cookies.jwt;
    if (chk) {
        jwt.verify(chk, process.env.JWTKEY, function (err, decoded) {
            if (err) {
                res.redirect('/signup');

            }
            else {
                res.render("docnew");
            }
        });
    }
    else {
        res.redirect('/signup');
    }
    
})

app.get('/addtocart', (req, res) => {
    const chk = req.cookies.jwt;
    if (chk) {
        jwt.verify(chk, process.env.JWTKEY, function (err, decoded) {
            if (err) {
                res.redirect('/signup');

            }
            else {
                res.render('addtocart');
            }
        });
    }
    else {
        res.redirect('/signup');
    }
    
})

app.get('/checkout', (req, res) => {
    const chk = req.cookies.jwt;
    if (chk) {
        jwt.verify(chk, process.env.JWTKEY, function (err, decoded) {
            if (err) {
                res.redirect('/signup');

            }
            else {
                res.render('checkout');
            }
        });
    }
    else {
        res.redirect('/signup');
    }
    
})