var GoogleSpreadsheet = require('google-spreadsheet');
var creds = require('./client_secret_googleSheets.json');
var doc = new GoogleSpreadsheet('1GqlATPmlCa0t6JxKVu3lrO0L7xE1Zp3X0nBl8lk3IDg');


exports.isUser = function(sub, callback){
	exports.getUsers(function (a) {
		for (var i = 0; i < a.length; i++) {
			if (sub == a[i]['sub']) {
				callback(true);
				return true;
			}
		}
		callback(false)
	});
}

exports.checkUser = function(userObject, callback){
	exports.getUsers(function (a) {
		var found=false;
		for (var i = 0; i < a.length; i++) {
			if (userObject['sub'] == a[i]['sub']) {
				a[i]["lastlogin"] = Date();
				found=true;
				a[i].save(function(){
					callback("old")
				});
			}
		}

		if(!found){
			userObject['creationdate']=Date();
			userObject['lastlogin']=Date();
			userObject['lastmodified']=Date();

		doc.addRow(1, userObject, function(err) {
				callback("new");
  if(err) {
    console.log(err);
  }
});
}
	});



}



exports.setUser = function (userObject, callback) { //updates user data



	exports.getUsers(function (a) {
		for (var i = 0; i < a.length; i++) {
			if (userObject['sub'] === a[i]['sub']) {
				a[i]["lastmodified"] = Date();
				a[i]["alertemail"]=userObject['alertemail']
				var classesalert=""
				var tradeproposals = {}
				if(a[i]["classesalert"]){
					classesalert=JSON.parse(a[i]["classesalert"])
				}
				if(a[i]["tradeproposals"]){
					tradeproposals=JSON.parse(a[i]["tradeproposals"])
				}
				a[i].save(function(){
					callback(tradeproposals)
				});
			}
		}
	});



}

Array.prototype.unique = function() {
    var a = this.concat();
    for(var i=0; i<a.length; ++i) {
        for(var j=i+1; j<a.length; ++j) {
            if(a[i] === a[j])
                a.splice(j--, 1);
        }
    }

    return a;
};

exports.setTradeProposal = function (userObject, offerings, requests, callback){
	console.log(offerings);
	console.log(requests);
	exports.getUsers(function (a) {
		found = false;
		for (var i = 0; i < a.length; i++) {
			if (userObject['sub'] == a[i]['sub']) {
				found = true
				var allProposals=[];
				a[i]["lastmodified"] = Date();
				if(!a[i]["tradeproposals"]){
					allProposals=[{"offerings":offerings, "requests":requests, "datecreated":a[i]["lastmodified"]}]
				}
				else{
					allProposals = JSON.parse(a[i]["tradeproposals"])
					if(!proposalExists(allProposals, offerings, requests)) {
						allProposals = allProposals.concat([{"offerings":offerings, "requests":requests, "datecreated":a[i]["lastmodified"]}])
					}
				}
				a[i]["tradeproposals"] = JSON.stringify(allProposals)
				a[i].save(function(){
					callback(allProposals)
				});
			}
		}
		if(!found){
			callback(null)
		}
	});
}

function proposalExists(allProposals, offerings, requests){
	result = false;
	allProposals.forEach(prop => { if(arraysEqual(prop.offerings, offerings) || arraysEqual(prop.requests, requests)) { result = true; } })
	return result;
}

function arraysEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length != b.length) return false;
  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}


exports.editTradeProposal = function (num,sub, offerings, requests, callback){
	exports.getUsers(function (a) {
		for (var i = 0; i < a.length; i++) {
			if (sub == a[i]['sub']) {
				var proposals=JSON.parse(a[i]['tradeproposals'])
				proposals[num]["offerings"]=offerings
				proposals[num]["requests"]=requests
				a[i]['tradeproposals']=JSON.stringify(proposals)
				a[i].save(function(){
					callback(proposals)
				})
			}
		}
	});
}

exports.getTradeProposals= function(sub, callback){
	exports.getUsers(function (a) {
		for (var i = 0; i < a.length; i++) {
			if (sub === a[i]['sub']) {
				if(a[i]['tradeproposals']){
				callback(JSON.parse(a[i]['tradeproposals']))}
				else{
					callback([])
				}
				return 1;
			}
		}
		callback([])
	});
}



exports.deleteTradeProposal=function(id,num,callback){
	exports.getUsers(function (a) {
		for (var i = 0; i < a.length; i++) {
			if (id === a[i]['sub']) {
				var tradeproposals=JSON.parse(a[i]["tradeproposals"])
				tradeproposals.splice(num,1)
				a[i]["tradeproposals"]=JSON.stringify(tradeproposals)
				a[i].save(callback);
			}
		}
	});
}

exports.getUsers = function (callback) {

	doc.useServiceAccountAuth(creds, function (err) {
		doc.getRows(1, function (err, rows) {

			callback(rows);

		});

	});
}
