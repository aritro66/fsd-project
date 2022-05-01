const jwt = require('jsonwebtoken');
const productcreater = require('../models/products');

const productlist = async (req, res) => {
    const chk = req.cookies.jwt;
    const productlist = await productcreater.find();

    // getting cookie named jwt
    if (chk) {  // checking if jwt exists
        jwt.verify(chk, process.env.JWTKEY, function (err, decoded) {   // verifing token
            if (err) {
                res.redirect('/signup');    // if not logged in

            }
            else {
                if (req.cookies.cart) {
                    res.render('allproducts', { productdata: productlist, cartlist: JSON.parse(req.cookies.cart), cartlength: JSON.parse(req.cookies.cart).length });  // if logged in
                }
                else {
                    res.render('allproducts', { productdata: productlist, cartlist: [], cartlength: 0 });  // if logged in
                }
            }
        });
    }
    else {
        res.redirect('/signup');    // if not logged in
    }
}

const productbyid = async (req, res) => {
    const chk = req.cookies.jwt;
    // getting cookie named jwt
    const productlist = await productcreater.find({ _id: req.params.id });

    if (chk) {  // checking if jwt exists
        jwt.verify(chk, process.env.JWTKEY, function (err, decoded) {   // verifing token
            if (err) {
                res.redirect('/signup');    // if not logged in
            }
            else {
                if (req.cookies.cart) {
                    const chk2 = JSON.parse(req.cookies.cart).filter(ele => ele.id === req.params.id);
                    res.render('sproducts', { data: productlist[0], flag: chk2.length, cartlength: JSON.parse(req.cookies.cart).length });    // if logged in
                }
                else {
                    res.render('sproducts', { data: productlist[0], flag: 0, cartlength: 0 });    // if logged in
                }
            }
        });
    }
    else {
        res.redirect('/signup');    // if not logged in
    }

}

module.exports = { productlist, productbyid };