'use strict'

const express = require("express");
const app = express();
const port = 3000;

// capture environment variables
require("dotenv").config();

const bodyparser = require("body-parser");
const Razorpay = require("razorpay");

app.use(bodyparser.json());

// middleware to serve static files from the directory 'img'
app.use(express.static(__dirname + "/img"));

var instance = new Razorpay({
    // prevents in exposing the secret keys
    key_id: process.env.KEY_ID,
    key_secret: process.env.KEY_SECRET
});

app.get("/", (req, res) => {
    res.sendFile("index.html", {root: __dirname});
})

app.post("/create/orderId", (req, res) => {
    console.log("create order request", req.body);

    var options = {
        amount: req.body.amount,
        currency: "INR",
        receipt: "rcp1"
    };
    instance.orders.create(options, function(err, order){
        console.log(order);
        res.send({orderId: order.id});
    })
})

app.post("/api/payment/verify",(req,res)=>{

    let body=req.body.response.razorpay_order_id + "|" + req.body.response.razorpay_payment_id;
   
     var crypto = require("crypto");
     var expectedSignature = crypto.createHmac('sha256', '1GRGhFfm789r5jKLv8ZKRPB2')
                                     .update(body.toString())
                                     .digest('hex');
                                     console.log("sig received " ,req.body.response.razorpay_signature);
                                     console.log("sig generated " ,expectedSignature);
     var response = {"signatureIsValid":"false"}
     if(expectedSignature === req.body.response.razorpay_signature)
      response={"signatureIsValid":"true"}
         res.send(response);
     });
   
   app.listen(port, () => {
     console.log(`Example app listening at http://localhost:${port}`)
   })