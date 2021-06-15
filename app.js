//Packages
const express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    methodOverride = require("method-override"),
    path = require("path"),
    flash = require("connect-flash");
//Env Variables
require('dotenv').config();


//Nodemailer
const nodemailer = require('nodemailer');
let transporter = nodemailer.createTransport({
    host: 'smtp.googlemail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAILUSER,
        pass: process.env.EMAILPASS,
    },
    tls: {
        rejectUnauthorized: false
    }
});

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

//Requiring routes
var indexRoutes = require("./routes/index");

//Locale
const locale = require("locale"),
    supportedLng = new locale.Locales(['en', 'lt', 'en_US', 'en_GB']),
    defaultLng = "en";
app.use(locale(supportedLng, defaultLng))



//ROUTER
app.use("/", indexRoutes);

app.get("/resume", (req, res) => {
    if (req.locale === 'lt') {
        res.render("resume-lt")
    } else {
        res.render("resume-en")
    }
})

app.get("/resume-en", (req, res) => {
    res.render("resume-en")
})
app.get("/resume-lt", (req, res) => {
    res.render("resume-lt")
})



app.post('/sendmail', (req, res) => {

    let name = req.body.name;
    let email = req.body.email;
    let message = req.body.text;


    let messageOptions = {
        from: email,
        name: name,
        to: process.env.EMAILUSER,
        subject: "Portfolio Email Contact",
        html: `Name: ${name}<br>Email: ${email}<br><p>${message}</p>`
    };

    transporter.sendMail(messageOptions, (error, info) => {
        if (error) {
            var flash = "error";
            console.log(error);
        } else {
            var flash = "success";
            console.log('Message %s sent: %s', info.messageId, info.response);
        }
        res.render("index", { flash: flash, name: name, email, email, message: message })
    });
});

app.get('*', function(req, res) {
    res.redirect('/');
});

app.listen(process.env.PORT, function() {
    console.log("Portfolio server has started!")
});