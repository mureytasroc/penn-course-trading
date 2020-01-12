var express = require('express');
var favicon = require('serve-favicon');


const requestIp = require('request-ip');
var moment = require('moment');
const ipInfo = require("ipinfo");
moment().format();


BLACKLISTED_ORGS = ["Amazon", "Google", "Microsoft", "Facebook"]


var https = require("https");

var multer = require('multer');

var app = express();

var User = require(__dirname + '/models/User');
var request = require('request');
var Admin = require(__dirname + '/models/Admin');

require('dotenv').config();


app.use(express.static('public', {maxAge: '0d', 'Cache-Control': 'no-cache'}));
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

/*
function getCrossListings(c, callback){
	Admin.getCreds(function(creds){
		const requestOptions = {
				url: 'https://esb.isc-seo.upenn.edu/8091/open_data/course_section_search?course_id='+c.replace(/-/g, "")+'&term='+process.env.CURRENT_SEMESTER,
				method: 'GET',
				headers: creds
		};
		request(requestOptions, function(err, response, body) {
			var parsedBody=JSON.parse(body)
			var result_data = parsedBody["result_data"]
			callback(result_data.map(m=>{return m.crosslistings.map(e=>{return e.subject+'-'+e.course_id+'-'+e.section_id})})[0] )
		});
	})
}
function recurseOfferings(i, courses, crosslistings, callback){
	if(i>=courses.length){ callback(crosslistings) }
	else{
		getCrossListings(courses[i], function(cl){
			crosslistings[courses[i]] = cl
			recurseOfferings(i+1, courses, crosslistings, callback)
		})
	}
}
function recurseTradeProposals(i, tradeproposals, crosslistingsArray, callback){
	if(i>= tradeproposals.length){
		callback(crosslistingsArray, tradeproposals)
	} else{
		recurseOfferings(0, tradeproposals[i].offerings, {}, function(crosslistings){
			recurseOfferings(0, tradeproposals[i].requests, crosslistings, function(crosslistings2){
				crosslistingsArray.push(crosslistings2)
				recurseTradeProposals(i+1, tradeproposals, crosslistingsArray, callback)
			})
		})
	}
}
User.getUsers(function(users){
	users.forEach(u=>{
		recurseTradeProposals(0, JSON.parse(u.tradeproposals), [], function(cla, tradeproposals){
			cla.forEach((e,i)=>{ tradeproposals[i].crosslistings=e })
			u.tradeproposals = JSON.stringify(tradeproposals)
			u.save(function(){console.log(u.name)})
		})
	})
})
*/

/*
function arraysEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length != b.length) return false;
  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

User.getUsers(function(users){
	for(var i=0; i<users.length; i++){
		console.log(users[i].email)
		for(var j=i+1; j<users.length; j++){
			checkForTrades(users[i], users[j])
		}
	}
})
function checkForTrades(user1, user2){
	if(user1.tradeproposals!="" && !arraysEqual(JSON.parse(user1.tradeproposals), []) && user2.tradeproposals!="" && !arraysEqual(JSON.parse(user2.tradeproposals), [])){
		JSON.parse(user1.tradeproposals).forEach(tp1=>{
			JSON.parse(user2.tradeproposals).forEach(tp2=>{
				oneToTwo = []
				tp1.offerings.forEach(o=>{
					tp2.requests.forEach(r=>{
						if(o==r || tp1.crosslistings[o].includes(r) || tp2.crosslistings[r].includes(o)){
							oneToTwo.push([o,r])
						}
					})
				})
				twoToOne = []
				tp1.requests.forEach(r=>{
					tp2.offerings.forEach(o=>{
						if(o==r || tp2.crosslistings[o].includes(r) || tp1.crosslistings[r].includes(o)){
							if(o==r || tp2.crosslistings[o].includes(r) || tp1.crosslistings[r].includes(o)){
								twoToOne.push([o,r])
							}
						}
					})
				})
				if(oneToTwo.length>0 && twoToOne.length>0){ tradeFound(user1, tp1, oneToTwo, twoToOne, tp2, user2) }
			})
		})
	}
}
function sendMessage(email, message){ console.log("MESSAGE TO "+email+":\n"+message) }
function tradeFound(user1, user1tp, oneToTwo, twoToOne, user2tp, user2){
	console.log("\n\nTRADE FOUND BETWEEN "+user1.email +" AND "+user2.email+"\n\n")
}
*/


app.get('/', function (request, response) {
	const ip = requestIp.getClientIp(request);
	ipInfo(ip, (err, cloc) => {
		if(!request.query.wakeup && (err || !cloc || !cloc.org || !BLACKLISTED_ORGS.reduce((t,c)=>{return t||cloc.org.includes(c)},false))){
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
		response.status(200); response.set({'Content-Type': 'text/html', maxAge: '0d', 'Cache-Control': 'no-cache'});
    //response.setHeader('Content-Type', 'text/html')
		response.render('index')
	})
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

    response.status(200); response.set({'Content-Type': 'text/html', maxAge: '0d', 'Cache-Control': 'no-cache'});
    //response.setHeader('Content-Type', 'text/html')
    response.render('about');

});






var textCreds = require('./models/client_secret_text.json')
const client = require('twilio')(textCreds["accountSid"], textCreds["authToken"]);


	var emailCreds = require('./models/client_secret_email.json')
	var nodemailer = require('nodemailer');

	var transporter = nodemailer.createTransport({
	  service: 'gmail',
	  auth: emailCreds
	});


/*
setInterval(function() {
    https.get("https://www.penncoursetrading.com/?wakeup=true");
}, 300000); // keeps Heroku website awake
*/


//MAIN NOTIFICATION FUNCTION
/*
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
*/

function min(a,b){
	if(a>=b){
		return b
	}
	else{
		return a
	}
}
