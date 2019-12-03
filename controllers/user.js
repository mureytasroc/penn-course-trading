var express = require('express');
var router = express.Router();

var request = require('request');

const ics = require('ics')

const requestIp = require('request-ip');
var moment = require('moment');
moment().format();


var User = require(__dirname + '/../models/User');

var Admin = require(__dirname + '/../models/Admin')

var FileServer = require(__dirname + '/../file_server');

var CLIENT_ID="196113113303-pkf1lo671dkdl9jpp9t596ocsp2ghd40.apps.googleusercontent.com"
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);








router.get('/userdetails', function(req, res) {

  const ip = requestIp.getClientIp(request);
	var log = {
		'Timestamp': moment().tz('America/New_York'),
		'IP': ip,
		'Verb': "GET",
		'Route': "/userdetails",
		'Page': "User Details"
	}
	console.log(log);
	Admin.log(log, function(){});

  res.status(200);
  res.setHeader('Content-Type', 'text/html')
  res.render('user_details');


})





async function verify(token, callback) {
  const ticket = await client.verifyIdToken({
      "audience": CLIENT_ID,
      "idToken": token
  });
  const pay = ticket.getPayload()
  callback(pay)
  // If request specified a G Suite domain:
  //const domain = payload['hd'];
}


router.post('/users', function(req, res) {

  const ip = requestIp.getClientIp(request);
	var log = {
		'Timestamp': moment().tz('America/New_York'),
		'IP': ip,
		'Verb': "POST",
		'Route': "/users",
		'Page': "user_details"
	}
	console.log(log);
	Admin.log(log, function(){});

  verify(req.body.id_token, function(payload){
    const domain = payload['hd'];
    if(payload['hd']!=null){
        if(domain.includes("upenn.edu") || domain.includes("trinityschoolnyc.org")){
    const userid = payload['sub'];
userObject = JSON.parse(JSON.stringify(payload))

    User.checkUser(userObject , function(response) {
      if(response=="new"){
        res.status(200);
        res.setHeader('Content-Type', 'text/html')
        res.render('user_details', {
          user_id: userid, 'userObject':userObject
        });
      }
      else{
        res.status(200);
        res.setHeader('Content-Type', 'text/html')
        res.render('user_details', {//CHANGE THIS !!!!!!!!!!!!!!!!!!!!!!!!!!!
          user_id: userid,  'userObject':userObject
        });
      }
    }); //gives response on whether this is a proper new user
}
else{
  notPenn();
}
  }
else{//no gsuite
  notPenn();
}
}).catch(console.error);

})




function notPenn(){
console.log("not penn")
}




router.get('/logout', function(req, res) {
  const ip = requestIp.getClientIp(request);
	var log = {
		'Timestamp': moment().tz('America/New_York'),
		'IP': ip,
		'Verb': "GET",
		'Route': "/logout",
		'Page': "index"
	}
	console.log(log);
	Admin.log(log, function(){});

  res.status(200);
  res.setHeader('Content-Type', 'text/html')
  res.render('index', {logout:true});
})



router.get('/tradeproposals', function(req, res) {
  const ip = requestIp.getClientIp(request);
	var log = {
		'Timestamp': moment().tz('America/New_York'),
		'IP': ip,
		'Verb': "GET",
		'Route': "/tradeproposals",
		'Page': "tradeproposals"
	}
	console.log(log);
	Admin.log(log, function(){});

  res.status(200);
  res.setHeader('Content-Type', 'text/html')
  res.render('tradeproposals');
})

router.get('/tradeproposalsInfo', function(req, res) {
  const ip = requestIp.getClientIp(request);
	var log = {
		'Timestamp': moment().tz('America/New_York'),
		'IP': ip,
		'Verb': "GET",
		'Route': "/tradeproposalsInfo",
		'Page': "none: tradeproposalsInfo"
	}
	console.log(log);
	Admin.log(log, function(){});

  User.getTradeProposals(req.query.id,function(tradeproposals){
  res.status(200);

  res.send(tradeproposals)
})

})

router.post('/useredit', function(req, res) {

  const ip = requestIp.getClientIp(request);
	var log = {
		'Timestamp': moment().tz('America/New_York'),
		'IP': ip,
		'Verb': "POST",
		'Route': "/useredit",
		'Page': "tradeproposals"
	}
	console.log(log);
	Admin.log(log, function(){});





var userObject = {}
    userObject['sub']=req.body.formID
userObject['alertemail']=req.body.email
userObject['phone']=req.body.phone
userObject['calendar']=req.body.jcal


    User.setUser(userObject , function(tradeproposals) {

        res.status(200);
        res.setHeader('Content-Type', 'text/html')
        res.render('tradeproposals', {
          id: req.body.formID, userObject:userObject, tradeproposals:tradeproposals
        });

    });




});

router.get('/coursesearch', function(req,res){

  var log = {
    'timestamp': Date(),
    'httpverb': "GET",
    'username': req.body.id,
    'route': "/coursesearch"
  }
  console.log(log);

  Admin.getCreds(function(creds){
    const requestOptions = {
        url: 'https://esb.isc-seo.upenn.edu/8091/open_data/course_info/'+req.query.dept+'/?number_of_results_per_page=1000',
        method: 'GET',
        headers: creds
    };
    request(requestOptions, function(err, response, body) {
      res.status(200);
      res.setHeader('Content-Type', 'text/html')
      var parsedBody=JSON.parse(body)
      var result_data = parsedBody["result_data"]
      //var meta = body["service_meta"]
      //var pages = meta["number_of_pages"]
      res.render('newtradeproposal',{apidata:result_data, dept:req.query.dept, course:req.query.course});
    });
  })


})

router.get('/setTradeProposal', function(req, res) {



  const ip = requestIp.getClientIp(request);
	var log = {
		'Timestamp': moment().tz('America/New_York'),
		'IP': ip,
		'Verb': "GET",
		'Route': "/setTradeProposal",
		'Page': "tradeproposals"
	}
	console.log(log);
	Admin.log(log, function(){});

  classes=req.query.classes
  if(!(classes instanceof Array)){
    classes = [classes]
  }


    const userid = req.query.formID;
userObject = {}
userObject['sub']=userid
var settings={}

if(req.query.autodelete==="on"){
  settings={"autodelete":true};//IMPLEMENT SETTINGS
}
else{
  settings={"autodelete":false};//IMPLEMENT SETTINGS
}
User.setTradeProposal(userObject, classes, settings, function(tradeproposals){
  res.status(200);
  res.setHeader('Content-Type', 'text/html')
  res.render('tradeproposals',{tradeproposals:tradeproposals});
})



})






router.get('/updateTradeProposal', function(req, res) {



  const ip = requestIp.getClientIp(request);
	var log = {
		'Timestamp': moment().tz('America/New_York'),
		'IP': ip,
		'Verb': "GET",
		'Route': "/updateTradeProposal",
		'Page': "tradeproposals"
	}
	console.log(log);
	Admin.log(log, function(){});

  classes=req.query.classes


    const userid = req.query.formID;
userObject = {}
userObject['sub']=userid
var settings="";

if(req.query.autodelete=="on"){
  settings={"autodelete":true};//IMPLEMENT SETTINGS
}
else{
  settings={"autodelete":false};//IMPLEMENT SETTINGS
}
num=req.query.num;

User.editTradeProposal(num,userid, classes, settings, function(tradeproposals){
  res.status(200);
  res.setHeader('Content-Type', 'text/html')
  res.render('tradeproposals',{tradeproposals:tradeproposals});
})



})




//here
router.post('/edittradeproposal', function(req, res) {

  const ip = requestIp.getClientIp(request);
	var log = {
		'Timestamp': moment().tz('America/New_York'),
		'IP': ip,
		'Verb': "POST",
		'Route': "/edittradeproposal",
		'Page': "tradeproposals"
	}
	console.log(log);
	Admin.log(log, function(){});

  if(req.body.edit){
    User.getTradeProposals(req.body.id,function(alerts){
      res.status(200);
      res.setHeader('Content-Type', 'text/html')
      res.render('newtradeproposal',{num:req.body.edit,tradeproposal:alerts[req.body.edit]});
    })
  }
  else if(req.body.delete){
    console.log("delete "+req.body.delete)
    User.deleteTradeProposal(req.body.id,req.body.delete,function(){
      res.status(200);
      res.setHeader('Content-Type', 'text/html')
      res.render('tradeproposals');
    })
  }
  else if(req.body.test){
    User.getUsers(function(a){
      for (var i = 0; i < a.length; i++) {
  			if (req.body.id === a[i]['sub']) {
          var alerts=JSON.parse(a[i]["classesalert"])
  				var alert=alerts[req.body.test]
          var classInd = Math.floor(Math.random() * alert["classes"].length)
  				var classi = alert["classes"][classInd]
          FileServer.notify(a[i]["email"],a[i]["phone"], classi+" opened up!", classi+" opened up!  You can now register on Penn Intouch (http://bit.ly/2k3Hris).  This message was brought to you by PennCourseAlertPlus.")
            var deleted=false;
          if(alert["settings"]["autodelete"]){
            if(alert["classes"].length==1){
              deleted=true;
              User.deleteTradeProposal(req.body.id,req.body.test,function(){
                res.status(200);
                res.setHeader('Content-Type', 'text/html')
                res.render('tradeproposals');
              })
            }
            else{
            alert["classes"].splice(classInd,1)
            alerts[req.body.test]=alert
            }
          }
          if(!deleted){
          a[i]["classesalert"]=JSON.stringify(alerts)
          a[i].save(function(){
            res.status(200);
            res.setHeader('Content-Type', 'text/html')
            res.render('tradeproposals');
          })
        }
  			}
  		}
    })

  }



});



router.get('/newtradeproposal', function(req, res) {

  const ip = requestIp.getClientIp(request);
	var log = {
		'Timestamp': moment().tz('America/New_York'),
		'IP': ip,
		'Verb': "GET",
		'Route': "/newtradeproposal",
		'Page': "newtradeproposal"
	}
	console.log(log);
	Admin.log(log, function(){});

  res.status(200);
  res.setHeader('Content-Type', 'text/html')
  res.render('newtradeproposal');


});











module.exports = router;
