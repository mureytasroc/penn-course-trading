var pennCreds = require('./client_secret_PennAPI.json');
var GoogleSpreadsheet = require('google-spreadsheet')
var creds = require('./client_secret_googleSheets.json')
var doc = new GoogleSpreadsheet('1GqlATPmlCa0t6JxKVu3lrO0L7xE1Zp3X0nBl8lk3IDg');
const ipInfo = require("ipinfo");
var moment = require('moment-timezone');
moment().format();

exports.getCreds = function (callback) {
  callback(pennCreds)
}

exports.log = function (logo, callback) {
	doc.useServiceAccountAuth(creds, function (err) {
    var timestamp=logo["Timestamp"]
    logo["Date"]=""+timestamp.format("MM/DD/YYYY");
    logo["Hour"]=""+timestamp.hour();
		logo["Timestamp"]=""+timestamp.format()
		ipInfo(logo["IP"], (err, cLoc) => {
        if(!err){
					if(cLoc){
						if(cLoc.country && cLoc.region && cLoc.city && cLoc.postal){
							logo["Location"] = cLoc.country + "," + cLoc.region + "," + cLoc.city+","+cLoc.postal;
						} else{ logo["Location"]="";}
						if(cLoc.loc){
			      	logo["LatLong"] = cLoc.loc.split(",")[0]+"/"+cLoc.loc.split(",")[1];
						}
						else{ logo["LatitudeLongitude"]="";}
						if(cLoc.org){
							logo["Organization"]=cLoc.org
						} else{logo["Organization"]="";}
					}
				}
				doc.addRow(2, logo, callback)
			});
	});
}
