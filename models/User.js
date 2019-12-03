var GoogleSpreadsheet = require('google-spreadsheet');
var creds = require('./client_secret_googleSheets.json');
var doc = new GoogleSpreadsheet('1RVzV2HyXrtTU7ydEOKoahnXNDYFmwpDPEcwDMEbGSJ0');




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
				if(userObject['phone']!=""){
				a[i]["phone"]=userObject['phone']}
				a[i]["alertemail"]=userObject['alertemail']
				a[i]["calendar"]=userObject['calendar']
				var classesalert=""
				if(a[i]["classesalert"]){
					classesalert=JSON.parse(a[i]["classesalert"])
				}
				a[i].save(function(){
					callback(classesalert)
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

exports.setNotification = function (userObject, classes, settings, callback){
	//console.log(settings);
	exports.getUsers(function (a) {
		for (var i = 0; i < a.length; i++) {
			if (userObject['sub'] == a[i]['sub']) {
				var allAlerts=[];
				a[i]["lastmodified"] = Date();

				if(!a[i]["classesalert"]){
					allAlerts=[{"classes":classes,"datecreated":a[i]["lastmodified"],"settings":{}}]
					a[i]["classesalert"]=JSON.stringify([{"classes":classes,"datecreated":a[i]["lastmodified"],"settings":settings}])
				}
				else{

					allAlerts=JSON.parse(a[i]["classesalert"]).concat([{"classes":classes,"datecreated":a[i]["lastmodified"],"settings":settings}])
					a[i]["classesalert"]=JSON.stringify(allAlerts)
				}
				a[i].save(function(){
					callback(allAlerts)
				});
			}
		}
	});
}


exports.editNotification = function (num,sub, classes, settings, callback){
	exports.getUsers(function (a) {
		for (var i = 0; i < a.length; i++) {
			if (sub == a[i]['sub']) {
				var alerts=JSON.parse(a[i]['classesalert'])
				alerts[num]["classes"]=classes
				alerts[num]["settings"]=settings
				a[i]['classesalert']=JSON.stringify(alerts)
				a[i].save(function(){
					callback(alerts)
				})
			}
		}
	});
}

exports.getAlerts= function(sub, callback){
	exports.getUsers(function (a) {
		for (var i = 0; i < a.length; i++) {
			if (sub === a[i]['sub']) {
				if(a[i]['classesalert']){
				callback(JSON.parse(a[i]['classesalert']))}
				else{
					callback([])
				}
			}
		}
	});
}



exports.deleteAlert=function(id,num,callback){
	exports.getUsers(function (a) {
		for (var i = 0; i < a.length; i++) {
			if (id === a[i]['sub']) {
				var alerts=JSON.parse(a[i]["classesalert"])
				alerts.splice(num,1)
				a[i]["classesalert"]=JSON.stringify(alerts)
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
