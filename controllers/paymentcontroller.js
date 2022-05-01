const ordercreater = require("../models/order");
const stripe = require("stripe")(`${process.env.STRIPESECRETEKEY}`);


const checkoutform = async (req, res) => {
    const chk = req.cookies.jwt;
    // getting cookie named jwt

    console.log(JSON.parse(req.cookies.cart));
    try {
        console.log(JSON.parse(req.cookies.cart).map(item => {

            return {
                price_data: {
                    currency: "inr",
                    product_data: {
                        name: item.name,
                    },
                    unit_amount: Number(item.price.slice(1).split('.').join('')),
                },
                quantity: item.quantity,
            }
        }))
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            line_items: JSON.parse(req.cookies.cart).map(item => {

                return {
                    price_data: {
                        currency: "inr",
                        product_data: {
                            name: item.name,
                        },
                        unit_amount: Number(item.price.slice(1).split('.').join('')),
                    },
                    quantity: item.quantity,
                }
            }),
            success_url: `${"http://localhost:4000"}/success`,
            cancel_url: `${"http://localhost:4000"}/addtocart`,
        })
        console.log(session.url)
        res.json({ url: session.url })
    } catch (e) {
        res.status(500).json({ error: e.message })
    }

}

const success = async (req, res) => {
    const data = await ordercreater.insertMany([{ order: req.cookies.cart, email: JSON.parse(req.cookies.myaccount).email }]);
    console.log(data)
    res.cookie('cart', JSON.stringify([]));

    res.render('success');
}

module.exports = { checkoutform, success };