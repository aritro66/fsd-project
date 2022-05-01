const jwt = require('jsonwebtoken');
const productcreater = require("../models/products");

const addtocartget = (req, res) => {
    const chk = req.cookies.jwt;
    // getting cookie named jwt
    if (chk) {  // checking if jwt exists
        jwt.verify(chk, process.env.JWTKEY, function (err, decoded) {   // verifing token
            if (err) {
                res.redirect('/signup');    // if not logged in

            }
            else {
                if (req.cookies.cart)
                    res.render('addtocart', { data: JSON.parse(req.cookies.cart) });    // if logged in
                else
                    res.render('addtocart', { data: [] });
            }
        });
    }
    else {
        res.redirect('/signup');    // if not logged in
    }

}

const addtocartpost = async (req, res, next) => {
    console.log(req.body);
    const productlist = await productcreater.find({ _id: req.body.productid });
    const chk = req.cookies.cart;
    if (chk) {
        let info = JSON.parse(req.cookies.cart);
        info.push({ id: req.body.productid, name: productlist[0].name, img: productlist[0].img, price: productlist[0].price, quantity: 1 });
        console.log(info);
        res.cookie('cart', JSON.stringify(info));
    }
    else {
        console.log("heheh");
        res.cookie('cart', JSON.stringify([{ id: req.body.productid, name: productlist[0].name, img: productlist[0].img, price: productlist[0].price, quantity: 1 }]))
    }
    next();
}

const deletecart = async (req, res, next) => {
    console.log(req.body);

    let info = JSON.parse(req.cookies.cart).filter(ele => ele.id !== req.body.productid);
    console.log(info);
    res.cookie('cart', JSON.stringify(info));

    next();
}

const dec = async (req, res, next) => {
    console.log(req.body);
    let info = JSON.parse(req.cookies.cart)
    for (let i = 0; i < info.length; i++) {
        if (info[i].id === req.body.productid) {
            info[i].quantity -= 1;
        }
    }
    console.log(info);
    res.cookie('cart', JSON.stringify(info));

    next();
}

const inc = async (req, res, next) => {
    console.log(req.body);
    let info = JSON.parse(req.cookies.cart)
    for (let i = 0; i < info.length; i++) {
        if (info[i].id === req.body.productid) {
            info[i].quantity += 1;
        }
    }
    console.log(info);
    res.cookie('cart', JSON.stringify(info));

    next();
}

module.exports = { addtocartget, addtocartpost, deletecart, inc, dec };