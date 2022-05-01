const diseasecreater = require('../models/diseases');
const jwt = require('jsonwebtoken');    // json web token

const diseaselist = async (req, res) => {
    const chk = req.cookies.jwt;
    // getting cookie named jwt
    const diseaselist = await diseasecreater.find({}, null, { sort: { name: 1 } });
    if (chk) {  // checking if jwt exists
        jwt.verify(chk, process.env.JWTKEY, function (err, decoded) {   // verifing token
            if (err) {
                res.redirect('/signup');    // if not logged in

            }
            else {
                if (req.cookies.cart) {
                    res.render("diseases", { diseaseslist: diseaselist, cartlength: JSON.parse(req.cookies.cart).length });  // if logged in
                }
                else {
                    res.render("diseases", { diseaseslist: diseaselist, cartlength: 0 });  // if logged in
                }
            }
        });
    }
    else {
        res.redirect('/signup');    // if not logged in
    }

}

const diseasebyid = async (req, res) => {
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
                if (req.cookies.cart) {
                    res.render("diseases2", { disease: singleDisease[0], cartlength: JSON.parse(req.cookies.cart).length }); // if logged in
                }
                else {
                    res.render("diseases2", { disease: singleDisease[0], cartlength: 0 }); // if logged in
                }
            }
        });
    }
    else {
        res.redirect('/signup');    // if not logged in
    }

}

module.exports = { diseaselist, diseasebyid };