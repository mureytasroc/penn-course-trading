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
        if(domain.includes("upenn.edu")){
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
  notPenn(res);
}
  }
else{//no gsuite
  notPenn(res);
}
}).catch(console.error);

})




function notPenn(res){
console.log("not penn")
res.status(401);
res.send("You must sign up with a Penn email")
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

router.get('/:user/tradeproposals', function(req, res) {
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

  User.getTradeProposals(req.params.user,function(tradeproposals){
    res.status(200);
    res.setHeader('Content-Type', 'application/json');
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
    'username': req.query.id,
    'route': "/coursesearch"
  }
  console.log(log);

  User.isUser(req.query.id, function(isUser){
    if(!isUser){
      res.status(403);
      res.setHeader('Content-Type', 'application/json');
      res.send("You must be a user to query course data");
    } else {

      dept = req.query.dept.replace(/[^A-Za-z]/g, "").toUpperCase()
      course = req.query.course.replace(/[^0-9]/g, "")
      section = req.query.section.replace(/[^0-9]/g, "")

      Admin.getCreds(function(creds){
        const requestOptions = {
            url: 'https://esb.isc-seo.upenn.edu/8091/open_data/course_section_search?course_id='+dept+course+section+'&term='+process.env.CURRENT_SEMESTER,
            method: 'GET',
            headers: creds
        };
        request(requestOptions, function(err, response, body) {
          var parsedBody=JSON.parse(body)
          var result_data = parsedBody["result_data"]
          res.status(200);
          res.setHeader('Content-Type', 'application/json');
          res.send({apidata:result_data, dept:dept, course:course, sec:section});
        });
      })

    }
  })


})

router.post('/tradeproposals', function(req, res) {

  if(req.body.methodname == 'post'){
    const ip = requestIp.getClientIp(request);
  	var log = {
  		'Timestamp': moment().tz('America/New_York'),
  		'IP': ip,
  		'Verb': "POST",
  		'Route': "/tradeproposals",
  		'Page': "tradeproposals"
  	}
  	console.log(log);
  	Admin.log(log, function(){});


    tradeproposal = JSON.parse(req.body.tradeproposal)

    offerings = tradeproposal.offerings
    requests = tradeproposal.requests


    userid = req.body.userid;

    userObject = {}
    userObject['sub']=userid

    User.setTradeProposal(userObject, offerings, requests, function(tradeproposals){
      res.status(200);
      res.setHeader('Content-Type', 'text/html')
      res.render('tradeproposals',{tradeproposals:tradeproposals});
    })
  } else{
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

      tradeproposal=JSON.parse(req.body.tradeproposal)


      const userid = req.body.userid;
      userObject = {}
      userObject['sub']=userid

    num=req.body.num;

    User.editTradeProposal(num, userid, tradeproposal.offerings, tradeproposal.requests, function(tradeproposals){
      res.status(200);
      res.setHeader('Content-Type', 'text/html')
      res.render('tradeproposals',{tradeproposals:tradeproposals});
    })
  }


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
    User.getTradeProposals(req.body.id,function(proposals){
      res.status(200);
      res.setHeader('Content-Type', 'text/html')
      res.render('tradeproposal',{num:req.body.edit,tradeproposal:proposals[req.body.edit]});
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



});



router.get('/tradeproposal', function(req, res) {

  const ip = requestIp.getClientIp(request);
	var log = {
		'Timestamp': moment().tz('America/New_York'),
		'IP': ip,
		'Verb': "GET",
		'Route': "/tradeproposal",
		'Page': "tradeproposal"
	}
	console.log(log);
	Admin.log(log, function(){});

  res.status(200);
  res.setHeader('Content-Type', 'text/html')
  res.render('tradeproposal');


});











module.exports = router;
