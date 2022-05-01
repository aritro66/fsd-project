const express = require('express');
const app = express();  //express app
const mongoose = require('mongoose');   // mongodb connecting
const cookieParser = require('cookie-parser');  // parse cookie data
// modals for users, otps, diseases and forgetpassword otps
require('dotenv').config(); // reading environment variables or automatically loads environment variables from a . env file into the process.
const paymentroutes = require('./routes/paymentroute');
const diseaseroutes = require('./routes/diseaseroute');
const cartroutes = require('./routes/cartroute');
const adminroutes = require('./routes/adminroute');
const productroutes = require('./routes/productroute');
const authroutes = require('./routes/authroute');
const otherroutes = require('./routes/otherroute');

const PORT = process.env.PORT || 4000;
// url to connect mongodb
const link = `mongodb+srv://${process.env.PASSWORD}:mongodb2002@cluster0.8et7m.mongodb.net/${process.env.DATABASENAME}`;
mongoose.connect(`${link}`, { useNewUrlParser: true, useUnifiedTopology: true }) // to avoid warning
    .then(() => {
        console.log("success");
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
app.use(paymentroutes);
app.use('/disease', diseaseroutes);
app.use('/product', productroutes);
app.use(cartroutes);
app.use(adminroutes);
app.use(authroutes);
app.use(otherroutes);