var creds = require('./client_secret_PennAPI.json');

exports.getCreds = function (callback) { //updates user data
  callback(creds)
}
