var express = require('express');
var favicon = require('serve-favicon');


const requestIp = require('request-ip');
var moment = require('moment');
moment().format();



var https = require("https");

var multer = require('multer');

var app = express();

var User = require(__dirname + '/models/User');
var request = require('request');
var Admin = require(__dirname + '/models/Admin')


app.use(express.static('public'));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(favicon(__dirname + '/public/images/favicon.png'));
app.use('/tradeproposal', express.static('public'));
app.use('/tradeproposal', favicon(__dirname + '/public/images/favicon.png'));
app.use('/search', express.static('public'));
app.use('/search', favicon(__dirname + '/public/images/favicon.png'));


app.use(express.urlencoded());



var methodOverride = require('method-override');
app.use(methodOverride('_method'));


app.use(require('./controllers/user'));


var port = process.env.PORT || 3000;
app.listen(port, function () {
	console.log('Server started at ' + new Date() + ', on port ' + port + '!');
});

var User = require(__dirname + '/models/User');

//////////////////////////////////////////////////////////////////////////////////////
///////////////////////GET request handling (largely uncommented)/////////////////////
//////////////////////////////////////////////////////////////////////////////////////

app.get('/', function (request, response) {

	const ip = requestIp.getClientIp(request);
	if(!request.query.wakeup){
		var log = {
			'Timestamp': moment().tz('America/New_York'),
			'IP': ip,
			'Verb': "GET",
			'Route': "/",
			'Page': "Home",
		}
		console.log(log);
		Admin.log(log, function(){});
	}
	else{
		var log = {
			'Timestamp': moment().tz('America/New_York'),
			'IP': ip,
			'Verb': "GET",
			'Route': "/",
			'Page': "Home (Self-Request)",
		}
		console.log(log);
	}
	response.status(200);
	response.setHeader('Content-Type', 'text/html')
		response.render('index')


});

app.get('/about', function (request, response) {

	const ip = requestIp.getClientIp(request);
	var log = {
		'Timestamp': moment().tz('America/New_York'),
		'IP': ip,
		'Verb': "GET",
		'Route': "/about",
		'Page': "about"
	}
	console.log(log);
	Admin.log(log, function(){});

    response.status(200);
    response.setHeader('Content-Type', 'text/html')
    response.render('about');

});

app.get('/search', function (request, response) {

	const ip = requestIp.getClientIp(request);
	var log = {
		'Timestamp': moment().tz('America/New_York'),
		'IP': ip,
		'Verb': "GET",
		'Route': "/search",
		'Page': "search"
	}
	console.log(log);
	Admin.log(log, function(){});

    response.status(200);
    response.setHeader('Content-Type', 'text/html')
    response.render('search');

});






var textCreds = require('./models/client_secret_text.json')
const client = require('twilio')(textCreds["accountSid"], textCreds["authToken"]);


	var emailCreds = require('./models/client_secret_email.json')
	var nodemailer = require('nodemailer');

	var transporter = nodemailer.createTransport({
	  service: 'gmail',
	  auth: emailCreds
	});



setInterval(function() {
    https.get("https://www.penncoursetrading.com/?wakeup=true");
}, 300000); // keeps Heroku website awake

	var old_result_data=[];




//MAIN NOTIFICATION FUNCTION
exports.notify=function(email, phoneNumber, subject, messageBody){

if(phoneNumber!=""){
client.messages
  .create({
     body: messageBody,
     from: '+12673100368',
     to: ("+1"+phoneNumber.replace("-",""))
   })
  .then(message => console.log(message.sid));
}

var mailOptions = {
	from: 'penncoursealertplus@gmail.com',
	to: email,
	subject: subject,
	text: messageBody
};


transporter.sendMail(mailOptions, function(error, info){
	console.log("sent")
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});

}

function min(a,b){
	if(a>=b){
		return b
	}
	else{
		return a
	}
}
