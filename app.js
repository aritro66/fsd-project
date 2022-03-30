const express = require('express');
const app = express();  //express app
const mongoose = require('mongoose');   // mongodb connecting
const bcrypt = require('bcryptjs');     // encrypting password
const jwt = require('jsonwebtoken');    // json web tocker
const cookieParser = require('cookie-parser');  // parse cookie data
const nodemailer = require('nodemailer');   // sending mail using node
const otpGenerator = require('otp-generator');  // generates otp
// modals for users, otps, diseases and forgetpassword otps
const creater = require('./models/users');  
const otpcreater = require('./models/otps');
const diseasecreater = require('./models/diseases');
const forgotpasswordotpcreater = require('./models/forgotpasswordotps');

require('dotenv').config(); // reading environment variables or automatically loads environment variables from a . env file into the process.


const PORT = process.env.PORT || 4000;
// url to connect mongodb
const link = `mongodb+srv://${process.env.PASSWORD}:mongodb2002@cluster0.8et7m.mongodb.net/${process.env.DATABASENAME}`;
mongoose.connect(`${link}`, { useNewUrlParser: true, useUnifiedTopology: true }) // to avoid warning
    .then(() => { console.log("success");
     app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); // listen for request
    })
    .catch((err) => console.log(err));

// setting view engine ejs
app.set('view engine', 'ejs');

// middlewares
app.use(express.static(__dirname + '/public'));     // accesing static files
app.use(express.urlencoded({ extended: false }));   // parsing form data
app.use(express.json());    // parsing json data
app.use(cookieParser());    // parsing cookie/cookie data

// req: request  res: response

// landing page route get method
// landing/starting page
app.get('/', (req, res) => {
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
});

// login page route get method
app.get('/login', (req, res) => {
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
});

// login form data post method
// login data
app.post("/login", async (req, res) => {
    console.log(req.body);
    try {
        const data2 = await creater.find({ email: req.body.email }); // finding user by email
        console.log(data2);
        if (data2) {

            const result = await bcrypt.compareSync(req.body.password, data2[0].password); // checks if password is correct
            if (result) {
                const token2 = jwt.sign(`${data2[0]._id}`, process.env.JWTKEY); // creating token 
                res.cookie('jwt', token2); // adding token to cookie
                res.cookie('myaccount', JSON.stringify({ fname: data2[0].fname, lname: data2[0].lname, email: data2[0].email, phno: data2[0].phno}));   // cookie for account data
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
})

// forgotpassword page route get method
app.get('/forgotpassword', (req, res) => {
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
});

// forgotpassword form data post method
app.post('/forgotpassword', async (req, res) => {
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
        const data = await forgotpasswordotpcreater.insertMany([{ otpno: otp, etime: end }]);
        res.json({ flag: "success" });

    } catch (error) {
        console.log(error);
    }


})
// checking forgot password otp post method
app.post('/forgotpasswordotp', async (req, res) => {
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


})

// changing or giving new password post method
app.post('/changepassword', async (req, res) => {
    console.log(req.body);
    try {
        var salt = bcrypt.genSaltSync(10); // generating salt
        // salt is a string of charcters different from password
        const pass = await bcrypt.hashSync(req.body.password, salt);
        // password is hashed using hashing algorithim and applying salt
        const result = await creater.updateOne({ email: req.body.email }, { $set: { password: pass } })
        // changin password
        console.log(result);
        res.json({ flag: "success" });

    } catch (error) {
        console.log(error);
    }
})

// generating otp while signup
app.post('/otp', async (req, res) => {
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


})

// signup page route get method
// signup page
app.get('/signup', (req, res) => {
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
});

// getting signup form data
app.post('/signup', async (req, res) => {
    console.log(req.body);
    if (req.body.password1 == req.body.password2) { // checks if both password equal
        try {
            const now = new Date().getTime();   // getting current time in millisecond
            const checkotp = await otpcreater.find({ otpno: req.body.otp })
            console.log(checkotp);
            if (checkotp) {     // checking otp
                if (parseInt(checkotp[0].etime) >= now) { // checking if otp is active
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

})

// home page route get method
app.get('/home', (req, res) => {
    const chk = req.cookies.jwt;
    // getting cookie named jwt
    if (chk) {  // checking if jwt exists
        jwt.verify(chk, process.env.JWTKEY, function (err, decoded) {   // verifing token
            if (err) {
                res.redirect('/signup');    // if not logged in

            }
            else {
                res.render('home')      // if logged in
            }
        });
    }
    else {
        res.redirect('/signup');    // if not logged in
    }
});


// myaccount page route get method
app.get('/myaccount', (req, res) => {
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

})

// products page route get method
// product list
app.get('/products', (req, res) => {
    const chk = req.cookies.jwt;
    // getting cookie named jwt
    if (chk) {  // checking if jwt exists
        jwt.verify(chk, process.env.JWTKEY, function (err, decoded) {   // verifing token
            if (err) {
                res.redirect('/signup');    // if not logged in

            }
            else {
                res.render('allproducts');  // if logged in
            }
        });
    }
    else {
        res.redirect('/signup');    // if not logged in
    }
})

// singleproduct page route get method
app.get('/singleproducts', (req, res) => {
    const chk = req.cookies.jwt;
    // getting cookie named jwt
    if (chk) {  // checking if jwt exists
        jwt.verify(chk, process.env.JWTKEY, function (err, decoded) {   // verifing token
            if (err) {
                res.redirect('/signup');    // if not logged in
            }
            else {
                res.render('sproducts');    // if logged in
            }
        });
    }
    else {
        res.redirect('/signup');    // if not logged in
    }

})

// diseases page route get method
app.get('/diseases', async (req, res) => {
    const chk = req.cookies.jwt;
    // getting cookie named jwt
    const diseaselist = await diseasecreater.find();
    if (chk) {  // checking if jwt exists
        jwt.verify(chk, process.env.JWTKEY, function (err, decoded) {   // verifing token
            if (err) {
                res.redirect('/signup');    // if not logged in

            }
            else {
                res.render("diseases", { diseaseslist: diseaselist });  // if logged in
            }
        });
    }
    else {
        res.redirect('/signup');    // if not logged in
    }

})

// particular disease page route get method
// using params
app.get('/disease/:id', async (req, res) => {
    const chk = req.cookies.jwt;
    // getting cookie named jwt
    const singleDisease = await diseasecreater.find({ _id: req.params.id });
    if (chk) {  // checking if jwt exists
        jwt.verify(chk, process.env.JWTKEY, function (err, decoded) {   // verifing token
            if (err) {
                res.redirect('/signup');    // if not logged in

            }
            else {
                console.log(singleDisease);
                res.render("diseases2", { disease: singleDisease[0] }); // if logged in
            }
        });
    }
    else {
        res.redirect('/signup');    // if not logged in
    }

})

// doctor page route get method

app.get('/doctor', (req, res) => {
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
    
})

// addtocart page route get method

app.get('/addtocart', (req, res) => {
    const chk = req.cookies.jwt;
    // getting cookie named jwt
    if (chk) {  // checking if jwt exists
        jwt.verify(chk, process.env.JWTKEY, function (err, decoded) {   // verifing token
            if (err) {
                res.redirect('/signup');    // if not logged in

            }
            else {
                res.render('addtocart');    // if logged in
            }
        });
    }
    else {
        res.redirect('/signup');    // if not logged in
    }
    
})

// checkout page route get method

app.get('/checkout', (req, res) => {
    const chk = req.cookies.jwt;
    // getting cookie named jwt
    if (chk) {  // checking if jwt exists
        jwt.verify(chk, process.env.JWTKEY, function (err, decoded) {   // verifing token
            if (err) {
                res.redirect('/signup');    // if not logged in

            }
            else {
                res.render('checkout'); // if logged in
            }
        });
    }
    else {
        res.redirect('/signup');    // if not logged in
    }
    
})

// about page route get method

app.get('/about', (req, res) => {
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
    
})

// logout

app.get('/logout', (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });   // jwt cookie expires in 1 milli second
    res.cookie('myaccount', '', { maxAge: 1 }); // myaccount cookie expires in 1 milli second
    res.redirect('/signup');
})