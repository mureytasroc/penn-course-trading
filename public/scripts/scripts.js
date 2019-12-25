var USER_ID = sessionStorage.getItem("user_id");

var WAITLIST_DEPT = ["CIS", "CIT", "NETS"]
var UNSUPPORTED_NOWAITLIST_DEPT = []

var UCC = ["PAD", "PDP", "PIN", "PGH"]
var UCC_EXPL = {
	PAD: "PERMISSION NEEDED FROM ADVISOR",
	PAU: "AUDITORS NEED PERMISSION",
	PCD: "PERMISSION NEEDED FROM DESIGN REGISTRAR",
	PCG: "PERMISSION NEEDED FROM LPS OFFICE",
	PCN: "NON-LPS STUDENTS NEED PERMISSION FROM LPS",
	PCW: "WRITING PROGRAM PERMISSION NEEDED",
	PDP: "PERMISSION NEEDED FROM DEPARTMENT",
	PGH: "NON-HONORS STUDENTS NEED PERMISSION",
	PIN: "PERMISSION NEEDED FROM INSTRUCTOR",
	PLC: "PENN LANGUAGE CENTER PERMISSION NEEDED",
	PNM: "NON-MAJORS NEED PERMISSION FROM DEPARTMENT",
	PUN: "UNDERGRADUATES NEED PERMISSION",
}

if (document.title == "Trade Proposals") {


$('#tradeproposalsList').html("<span style='color:green;'>Loading trade proposals...</span>")


if($('#user_id').text()!=""){
    sessionStorage.clear()
    USER_ID = $('#user_id').html()
    sessionStorage.setItem("user_id",USER_ID)
}

if($('#tradeproposals').text()==""){
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    $('#tradeproposals').text(this.responseText)
    finishPopulatingAlerts();
  }
};
xhttp.open("GET", "/"+USER_ID+"/tradeproposals", true);
xhttp.send();
}
else{
finishPopulatingAlerts();
}

}

function finishPopulatingAlerts() {
	var tradeproposals = JSON.parse($('#tradeproposals').text())
	var html = "<input type='text' name='id' value='" + USER_ID + "' class='hide'><table style='table-layout:fixed; width:100%;'><tr><th>Course(s) To Give</th><th>Course(s) To Receive</th><th>Actions</th></tr>"
	for (var i = 0; i < tradeproposals.length; i++) {
		html += "<tr><td><div class='tableDiv'>" + tradeproposals[i]["offerings"] + "</div></td><td><div class='tableDiv'>" + tradeproposals[i]["requests"] + "</div></td>";
		html += "<td><div class='tableDiv'><button type='submit' name='edit' value=" + i + ">Edit</button><button type='submit' name='delete' value=" + i + ">Delete</button></div></td></tr>"
	}
	html += "</table>"

	$('#tradeproposalsList').html(html)
}







function renderTradeProposal(editing) {
	var htmlStuff = "<div class='bodydiv'><form id='tradeproposalform' action='/tradeproposals' method='post'><input class='hide' type='text' name='methodname' value='"
	if(editing){ htmlStuff += "put"} else{ htmlStuff += "post" }
	htmlStuff += "'><input class='hide' type='text' name='userid' value='" + USER_ID + "'><input class='hide' type='text' name='num' value='" + $('#edit-num').text() + "'><input class='hide' type='text' name='tradeproposal' value='" + JSON.stringify(tradeproposal) + "'><br><h3>Courses Willing to <span style='color:red'>Give</span></h3>";
	for (var i = 0; i < tradeproposal.offerings.length; i++) {
    var name = tradeproposal.offerings[i];
    htmlStuff += "<span style='color:blue; cursor:pointer;' onclick=\"deselectCourse('"+JSON.stringify(editing)+"', '"+name+"')\" class='iconify' data-icon='vs:x-square' data-inline='false'></span>&nbsp;<span>"+name+"</span><br>";
	}
	htmlStuff += "<br><br><h3>Courses Willing to <span style='color:green'>Receive</span></h3>";
	for (var i = 0; i < tradeproposal.requests.length; i++) {
    var name = tradeproposal.requests[i];
    htmlStuff += "<span style='color:blue; cursor:pointer;' onclick=\"deselectCourse('"+JSON.stringify(editing)+"', '"+name+"')\" class='iconify' data-icon='vs:x-square' data-inline='false'></span>&nbsp;<span>"+name+"</span><br>";
	}
  htmlStuff+="<br><br><br><input type='submit' value='"
  if (editing) {htmlStuff += "Update Trade Proposal"} else {htmlStuff += "Create Trade Proposal"}
  htmlStuff +="'></div></form>"
	$('#tradeproposaldiv').html(htmlStuff);

  $('#tradeproposalform').submit(function(){
    if(tradeproposal.offerings.length == 0 || tradeproposal.requests.length == 0){
      alert("You must request at least one course and offer at least one course.")
      return false;
    }
    return true;
  })

}

function renderSearchResults(editing){
  if ($('#api_data').text() != "") {
		courseData = JSON.parse($('#api_data').text())
    if(WAITLIST_DEPT.includes($('#dept').val())){
      $('#results').html("<br><span style='color:red;'>The "+$('#dept').val()+" department has a waitlist system so its courses cannot be traded.</span>")
    } else if(UNSUPPORTED_NOWAITLIST_DEPT.includes($('#dept').val())){
      $('#results').html("<br><span style='color:red;'>The "+$('#dept').val()+" department does not support trading right now.</span>")
    } else if(courseData.length == 0){
      $('#results').html("<br><span style='color:red;'>No matching courses found for this semester.")
    } else{
      courseData = courseData.filter(function(c){return !tradeproposal.offerings.includes(c["section_id_normalized"].replace(/\s/g,'')) && !tradeproposal.requests.includes(c["section_id_normalized"].replace(" ", "")) })
  		var requestedCourseNum = $('#course').val()
      var htmlStuff = "";
  		for (var i = 0; i < courseData.length; i++) {
  			var name = courseData[i]["section_id_normalized"].replace(" ", "")
  			htmlStuff += "<br><span onclick=\"offerCourse('"+JSON.stringify(editing)+"', '"+name+"')\" style='border-radius: 5px; padding: 1px 2px 1px 2px; background-color: red; color:white; cursor: pointer;' title='Offer' >Give</span> <span onclick=\"requestCourse('"+JSON.stringify(editing)+"', '"+name+"')\" title='Request' style='border-radius: 5px; padding: 1px 2px 1px 2px; background-color: green; color:white; cursor: pointer;'>Receive</span> <span>" + name + "</span>"
  		}
  		$('#results').html(htmlStuff)
    }
	}
}

var tradeproposal = {
  offerings: [],
  requests: []
};

function offerCourse(edstring, name){
  editing = JSON.parse(edstring)
  if(JSON.parse($('#api_data').text()).find(c => { return c["section_id_normalized"].replace(/\s/g,'') == name})["important_notes"].includes("Permission Needed From Department")){ alert("This course cannot be traded (it requires a permit).") }
  else{
    tradeproposal.offerings.push(name)
    renderSearchResults(editing)
    renderTradeProposal(editing)
  }
}
function requestCourse(edstring, name){
  editing = JSON.parse(edstring)
	var reqs = JSON.parse($('#api_data').text()).find(c => { return c["section_id_normalized"].replace(/\s/g,'') == name})["requirements"]
	var ucc = reqs.reduce(function(total, currentVal){ if(UCC.includes(currentVal.registration_control_code)){ return total.concat([currentVal.registration_control_code])} else{ return total } } , [])
	var other_cc = reqs.reduce(function(total, currentVal){ if(UCC.includes(currentVal.registration_control_code)){ return total.concat([currentVal.registration_control_code])} else{ return total } } , [])
	if(reqs.reduce(function(total, currentVal){ return total || UCC.includes(currentVal.registration_control_code) } , false)){ mesg = "This course cannot be traded.  It has the following unsupported permit requirement(s):\n"; ucc.forEach(function(e){ mesg += "\n"+UCC_EXPL[e]+"\n"}); alert(mesg) }
  else{
		mesg = "Confirm that you are currently able to add this course, based on its permit requirements:\n"
		other_cc.forEach(function(e){ mesg += "\n"+UCC_EXPL[e]})
		if(other_cc.length==0 || confirm(mesg)){
    tradeproposal.requests.push(name)
    renderSearchResults(editing)
    renderTradeProposal(editing)}
  }
}
function deselectCourse(edstring, name){
  editing = JSON.parse(edstring)
  tradeproposal.offerings = tradeproposal.offerings.filter(function(c){ return c != name })
  tradeproposal.requests = tradeproposal.requests.filter(function(c){ return c != name })
  renderSearchResults(editing)
  renderTradeProposal(editing)
}

function searchFun(editing){
  dept = $('#dept').val().replace(/[^A-Za-z]/g, "").toUpperCase()
  $('#dept').val(dept)
  course = $('#course').val().replace(/[^0-9]/g, "")
  $('#course').val(course)
  section = $('#section').val().replace(/[^0-9]/g, "")
  $('#section').val(section)
  if(dept.length < 3 || dept.length > 4){ $('#dept').css('border-color', 'red'); setTimeout(function(){alert("Department code must have 3 to 4 letters.")}, 50); }
  else if(course.length != 3){ $('#course').css('border-color', 'red'); setTimeout(function(){alert("Course code must have 3 numbers (include leading 0s).")}, 50); }
  else if(section.length > 3){ $('#section').css('border-color', 'red'); setTimeout(function(){alert("Section cannot have more than 3 numbers.")}, 50); }
  else {
    if(WAITLIST_DEPT.includes($('#dept').val())){
      $('#results').html("<br><span style='color:red;'>The "+$('#dept').val()+" department has a waitlist system so its courses cannot be traded.</span>")
    } else if(UNSUPPORTED_NOWAITLIST_DEPT.includes($('#dept').val())){
      $('#results').html("<br><span style='color:red;'>The "+$('#dept').val()+" department does not support trading right now.</span>")
    } else{
      $('#results').html("<br><span style='color:green;'>Searching for courses matching: '"+dept+"-"+course+"-"+section+"' ...</span>")
      $.get("/coursesearch?dept="+$('#dept').val()+"&course="+$('#course').val()+"&section="+$('#section').val()+"&id="+USER_ID, function(data, status){
        $('#api_data').text(JSON.stringify(data.apidata))
        $('#dept').val(data.dept)
        $('#course').val(data.course)
        $('#section').val(data.sec)
        renderSearchResults(editing);
      });
    }
  }
}


if (document.title == "Trade Proposal") {

	var editing = false;
	var tradeproposalnum = -1;
	if ($("#edit-num").text() != "") {
		editing = true;
		tradeproposalnum = parseInt($('#edit-num').text());
		tradeproposal = JSON.parse($('#edit-proposal').text())
	}

	renderTradeProposal(editing);
  renderSearchResults(editing);

  $('#dept').keypress(function(event){
    $('#dept').css('border-color', '');
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if(keycode == '13'){ searchFun(editing); }
  })
  $('#course').keypress(function(event){
    $('#course').css('border-color', '');
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if(keycode == '13'){ searchFun(editing); }
  })
  $('#section').keypress(function(event){
    $('#section').css('border-color', '');
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if(keycode == '13'){ searchFun(editing); }
  })

  $('#searchbut').click(function(){searchFun(editing)})



}


if (document.title == "User Details") {

	if ($('#user_id').text() != "") {
		sessionStorage.clear()
		USER_ID = $('#user_id').text()
		sessionStorage.setItem("user_id", USER_ID)

	}

	$('#formID').val(USER_ID)

}


if (USER_ID == null && document.title != "Penn Course Trading" && document.title != "About") {
	console.log("scripts.js 122: USER_ID == NULL")
	signOut()
}


function onSignIn(googleUser) {

	if ($('#logout').text() == "true") {
		/*var auth2 = gapi.auth2.getAuthInstance();
		auth2.signOut().then(function () {
		  console.log('User signed out.');
		});*/
		var id_token = googleUser.getAuthResponse().id_token;

		var auth2 = gapi.auth2.getAuthInstance();
		auth2.disconnect();
		//if this did not have time to sign out put below lines in setTimeout to make a delay
		$('#google_token').val(id_token); //hidden form value
		$('#google-oauth').submit(); //hidden form
		$('#logout').text("")

	} else {
		// Useful data for your client-side scripts:
		var profile = googleUser.getBasicProfile()
		var domain = googleUser.getHostedDomain()
		if (typeof domain == "undefined") {
			signOutHome()
			//deleteAllCookies();
			alert("Please sign in with your UPenn email.")
		} else if (!(domain.includes("upenn.edu"))) {
			signOutHome()
			alert("Please sign in with your UPenn email.")
		} else {

			var queryString = ""

			queryString += "fname:"
			console.log("ID: " + profile.getId()); // Don't send this directly to your server!
			console.log('Full Name: ' + profile.getName());
			console.log('Given Name: ' + profile.getGivenName());
			console.log('Family Name: ' + profile.getFamilyName());
			console.log("Image URL: " + profile.getImageUrl());
			console.log("Email: " + profile.getEmail());

			// The ID token you need to pass to your backend:
			var id_token = googleUser.getAuthResponse().id_token;


			//(sessionStorage.getItem("id_token") == null)//checks if signedIn

			post('/users/', {
				"id_token": id_token
			}); //

			console.log("ID Token: " + id_token);

		}
	}
}

function signOutHome() {
	var auth2 = gapi.auth2.getAuthInstance();
	auth2.signOut().then(function () {
		console.log('User signed out.');
	});
}

function signOut() {
	sessionStorage.clear()
	window.location = "/logout";
}

function deleteAllCookies() {
	var cookies = document.cookie.split(";");

	for (var i = 0; i < cookies.length; i++) {
		var cookie = cookies[i];
		var eqPos = cookie.indexOf("=");
		var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
		document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
	}
}


function renderButton() {
	gapi.signin2.render('my-signin2', {
		'scope': 'profile email',
		'width': 240,
		'height': 50,
		'longtitle': true,
		'theme': 'dark',
		'onsuccess': onSignIn,
		'prompt': 'select_account'
	});

}


function post(path, params, method = 'post') {

	// The rest of this code assumes you are not using a library.
	// It can be made less wordy if you use one.
	const form = document.createElement('form');
	form.method = method;
	form.action = path;

	for (const key in params) {
		if (params.hasOwnProperty(key)) {
			const hiddenField = document.createElement('input');
			hiddenField.type = 'hidden';
			hiddenField.name = key;
			hiddenField.value = params[key];

			form.appendChild(hiddenField);
		}
	}

	document.body.appendChild(form);
	form.submit();
}

if (!USER_ID) {
	$('#headerLoggedIn').addClass('hide')
	$('#headerLogout').css('display', 'none')
	$('#headerLogout').text("Sign Out")

} else {
	$('#headerLoggedIn').removeClass('hide')
	$('#headerLogout').text("Sign Out")
	$('#headerLogout').css('display', 'block')
	$('#headerLogout').css('color', 'white')
	$('#headerLogout').click(signOut);
}
