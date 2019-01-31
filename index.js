const express = require('express')
const dotenv = require('dotenv').config()
const TwoFactor = new(require('2factor'))(process.env.api_key)
var exphbs  = require('express-handlebars');
var bodyParser = require('body-parser')

const app = express()

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())


app.get('/',function(req, res){
    res.render('index',{
        title: "2factor"
    });
});

let SeId;

app.post('/data',function(req, res){
    TwoFactor.sendOTP(req.body.number, {otp: req.body.otp, template: req.body.temp}).then((sessionId) => {
        SeId=sessionId;
        console.log(SeId);
        res.render('verify');
      }, (error) => {
        console.log(error)
      })

});


app.post('/verify',function(req, res){
    TwoFactor.verifyOTP(SeId, req.body.verify).then((response) => {
        res.write("verified");
        res.end();
      }, (error) => {
        console.log(error)
      })
});

app.listen(3000,function(req, res){
    console.log("server is running")
});
