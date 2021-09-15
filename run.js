const axiosHttp = require("axios")
const moment = require("moment")
const {parse} = require("dotenv");
require('dotenv').config()
const sendMail= (bid,ask,spread,price,status='')=>{
    let api_key = process.env.API_KEY;
    let domain = process.env.DOMAIN;
    let mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});

    let data = {
        from: 'Pengingat <indra.gunanda@gmail.com>',
        to: 'indra.gunanda@gmail.com',
        subject: `Pengingat AQUA Network ${status}`,
        text: `BID : ${bid}\nASK : ${ask}\nSPREAD : ${spread}\nPRICE : ${price}`
    };

    mailgun.messages().send(data, function (error, body) {
        console.log("Pengingat Dikirim");
    });
}
const interval = setInterval(()=>{
    axiosHttp
        .get("https://api.stellarterm.com/v1/ticker.json")
        .then((r)=>{
            const minimal = parseFloat(process.env.HARGA_MINIMAL)
            const optimal = parseFloat(process.env.HARGA_OPTIMAL)
            const {pairs} = r.data
            const {bid,ask,spread,price} = pairs['AQUA-aqua.network/XLM-native']
            console.log("vvvvvvvvvvvvvvvvvvvv")
            console.log("Tanggal >",moment().format("DD-MM-YYYY HH:mm:ss"))
            console.log("Minimal Harga",minimal)
            console.log("Optimnal Harga",optimal)
            console.log("BID",bid,'XLM')
            console.log("ASK",ask,'XLM')
            console.log("Spread",spread,'XLM')
            console.log("Price",price,'XLM')
            console.log("^^^^^^^^^^^^^^^^^^^^")
            if (price <= minimal){
                console.log("Minimal Price Triggered",price,minimal)
                sendMail(bid,ask,spread,price,"MINIMAL")
            }

            if (price >= optimal){
                console.log("Optimal Price Triggered",price,optimal)
                sendMail(bid,ask,spread,price,"OPTIMAL")
            }

        })
        .catch((r)=>{
            clearInterval(interval)
            console.log("NetworkError",r)
        })
},10000)
