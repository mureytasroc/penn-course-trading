var express = require('express');
var favicon = require('serve-favicon');

var multer = require('multer');

var app = express();

var User = require(__dirname + '/models/User');
var request = require('request');
var Admin = require(__dirname + '/models/Admin')

var https = require("https");

app.use(express.static('public'));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(favicon(__dirname + '/public/images/logo.png'));


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

    var log = {
        'timestamp': Date(),
        'httpverb': "GET",
        'username': "",
        'route': "/"
    }
    console.log(log);
//test
		response.render('index')


});

app.get('/about', function (request, response) {

    var log = {
        'timestamp': Date(),
        'httpverb': "GET",
        'username': "",
        'route': "/about"
    }
    console.log(log);

    response.status(200);
    response.setHeader('Content-Type', 'text/html')
    response.render('about');

});

app.get('/search', function (request, response) {

    var log = {
        'timestamp': Date(),
        'httpverb': "GET",
        'username': "",
        'route': "/search"
    }
    console.log(log);

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

	setInterval(checkCourses , 5000);


setInterval(function() {
    https.get("https://www.penncoursealertplus.com");
}, 300000); // keeps Heroku website awake

	var old_result_data=[];

	function checkCourses(){
		User.getUsers(function(a){

			Admin.getCreds(function(creds){
				const requestOptions = {
						url: 'https://esb.isc-seo.upenn.edu/8091/open_data/course_status/2019A/all',
						method: 'GET',
						headers: creds
				};
				request(requestOptions, function(err, response, body) {

					var parsedBody=JSON.parse(body)
					var result_data = parsedBody["result_data"]
					for (var r =0; r<min(result_data.length,old_result_data.length);i++){
						if(result_data[r]["status"]!=old_result_data[r]["status"]&&result_data[r]["course_section"]===old_result_data[r]["course_section"]&&result_data[r]["status"]==="O"){
						for (var i = 0; i < a.length; i++) {
							for (var e=0; e< JSON.parse(a[i]["classesalert"]).length; e++){
      					for (var j=0; j<JSON.parse(a[i]["classesalert"])[e]["classes"].length; j++){
								if(result_data[r]["course_section"].includes(JSON.parse(a[i]["classesalert"])[e]["classes"][j].replace("-","")) ){
										exports.notify(a[i]["email"],a[i]["phone"], result_data[r]["course_section"]+" opened up!", result_data[r]["course_section"]+" opened up!  You can now register on Penn Intouch (http://bit.ly/2k3Hris).  This message was brought to you by PennCourseAlertPlus.")
										if(JSON.parse(a[i]["classesalert"])[e]["settings"]["autodelete"]){
											if(alert["classes"].length==1){
					              User.deleteAlert(a[i]["sub"],e,function(){})
					            }
											else{
											var newClasses=JSON.parse(a[i]["classesalert"])[e]["classes"]
											newClasses.splice(j,1)
											var newAlert=JSON.parse(a[i]["classesalert"])
											newAlert[e]["classes"]=newClasses
											a[i]["classesalert"]=JSON.stringify(newAlert)
											a[i].save()
										}
											j--;
										}
								}

							}
						}
					}
					}
				}

				} );
			})

		})
	}


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
