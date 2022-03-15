const express = require('express');
const app = express();
const mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var cookieParser = require('cookie-parser');

// var hash = bcrypt.hashSync("B4c0/\/", salt);
const link = "mongodb+srv://aritro10021:mongodb2002@cluster0.8et7m.mongodb.net/project";
mongoose.connect(`${link}`, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => { console.log("success"); app.listen(4000); })
.catch((err) => console.log(err));

const order = new mongoose.Schema({
    name: { type: String, require: true, unique: true },
    password: { type: String, require: true }
});
const creater = new mongoose.model("user_list", order);
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser());

app.get('/', (req, res) => {
    const chk=req.cookies.jwt;
    if(chk)
    {
        jwt.verify(chk,'hide',function(err, decoded) {
            if(err)
            {
            res.redirect('/signup');
            }
            else
            {
             res.redirect('/university');
            }
          });
    }
    else
    {

        res.redirect('/signup');
    }
});
app.get('/login', (req, res) => {
    const chk=req.cookies.jwt;
    if(chk)
    {
        jwt.verify(chk,'hide',function(err, decoded) {
            if(err)
            {
        res.sendFile(__dirname + '/login.html');
            
            }
            else
            {
             res.redirect('/university');
            }
          });
    }
    else
    {

        res.sendFile(__dirname + '/login.html');
    }
});
app.post("/login", async (req, res) => {
    console.log(req.body);
    try {
        const data2 = await creater.find({ name: req.body.email });
        console.log(data2);
        if (data2) {
            // if(data2.password==req.body.password)
            // {
            //     res.redirect('/university');
            // }
            // else{
            // res.send('wrong email or password');

            // }
            const result=await bcrypt.compareSync(req.body.password, data2[0].password);
            if (result) {
                const token2=jwt.sign(`${data2[0]._id}`,'hide');
            res.cookie('jwt',token2);
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
app.get('/signup', (req, res) => {
    const chk=req.cookies.jwt;
    if(chk)
    {
        jwt.verify(chk,'hide',function(err, decoded) {
            if(err)
            {
                res.sendFile(__dirname + '/signup.html');
            
            }
            else
            {
             res.redirect('/university');
            }
          });
    }
    else
    {

        res.sendFile(__dirname + '/signup.html');
    }
});
app.post('/signup', async (req, res) => {
    console.log(req.body);
    if (req.body.password1 == req.body.password2) {
        try {
            var salt = bcrypt.genSaltSync(10);
            const pass = await bcrypt.hashSync(req.body.password1, salt);
            const data = await creater.insertMany([{ name: req.body.email, password: pass }]);
            const token=jwt.sign(`${data._id}`,'hide');
            res.cookie('jwt',token);
            res.redirect("/university");
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
    const chk=req.cookies.jwt;
    if(chk)
    {
        jwt.verify(chk,'hide',function(err, decoded) {
            if(err)
            {
                res.redirect('/signup');
            
            }
            else
            {
                res.sendFile(__dirname + '/index.html')
            }
          });
    }
    else
    {
        res.redirect('/signup');
    }
});
app.get('/logout',(req,res)=>{
    res.cookie('jwt','',{maxAge:1});
    res.redirect('/signup');
})