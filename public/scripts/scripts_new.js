var USER_ID = sessionStorage.getItem("user_id");

var WAITLIST_DEPT = ["CIS", "CIT", "NETS"]
var UNSUPPORTED_NOWAITLIST_DEPT = []

var UCC = ["PAD", "PDP", "PIN", "PGH", "PCD", "PCG", "PCW", "PLC"] // make sure these codes are in UCC_EXPL
var UCC_EXPL = {
	CA: "SECTION ACTIVITY CO-REQUISITE REQUIRED",
	CC: "COURSE CO-REQUISITE REQUIRED",
	CS: "SECTION CO-REQUISITE REQUIRED",
	//MAC: "FULFILLS ASC CULTURE REQUIREMENT",
	//MAD: "FULFILLS ASC INSTITUTIONS DISTRIBUTION",
	//MAI: "FULFILLS ASC INFLUENCE REQUIREMENT",
	//MAL: "STRUCTURED,ACTIVE,IN-CLASS LEARNING",
	//MAM: "ATTENDANCE AT FIRST CLASS MANDATORY",
	MAP: "ADVANCED PLACEMENT SECTION",
	MAY: "COURSE APPROVED FOR ONE YEAR",
	MBA: "MBA COURSE",
	//MBC: "CROSS CULTURAL INTERACTIONS AND DIVERSITY",
	MBD: "ONLY OPEN TO MASTER OF BEH & DEC SCI STUDENTS",
	//MBE: "ETHICAL REASONING",
	//MBG: "GATEWAY WRITING",
	//MBL: "OBJECTS-BASED LEARNING COURSE",
	//MBN: "QUANTITATIVE",
	//MBP: "SCIENTIFIC PROCESS",
	//MBQ: "GATEWAY QUALITATIVE",
	//MBS: "GATEWAY SCIENTIFIC PROCESS",
	//MBT: "QUALITATIVE",
	//MBV: "GATEWAY QUANTITATIVE",
	//MBW: "WRITING",
	//MC1: "CROSS CULTURAL ANALYSIS",
	//MC2: "CULTURAL DIVERSITY IN US",
	MCA: "ENROLLMENT BY APPLICATION ONLY",
	//MCC: "COMPUTING CERTIFICATE - ARTS AND SCIENCES",
	MCG: "COURSE MUST BE TAKEN FOR A GRADE",
	MCO: "LPS ONLINE PROGRAM COURSE",
	MCP: "ONLY OPEN TO LPS PB PRE-HEALTH STUDENTS",
	MCS: "ONLY OPEN TO LPS STUDENTS",
	//MDA: "ARTS & LETTERS SECTOR",
	//MDB: "HUM/SOC SCI - NAT SCI/MATH SECTOR",
	MDC: "COURSE TAUGHT IN WASHINGTON, DC",
	MDD: "FOR DOCTORAL STUDENTS ONLY",
	//MDF: "FORMAL REASONING & ANALYSIS",
	//MDH: "HISTORY & TRADITION SECTOR",
	//MDL: "LIVING WORLD SECTOR",
	MDM: "SEE SPECIAL MESSAGE IN DEPARTMENT HEADER",
	//MDN: "NATURAL SCIENCE & MATH SECTOR",
	//MDO: "HUMANITIES & SOCIAL SCIENCE SECTOR",
	//MDP: "PHYSICAL WORLD SECTOR",
	//MDS: "SOCIETY SECTOR",
	//MDT: "GEN REQ I: SOCIETY",
	//MDU: "GEN REQ II: HIST & TRAD",
	//MDV: "GEN REQ III: ARTS & LET",
	//MDW: "FORMAL REASONING",
	//MDX: "GEN REQ V: LIVING WRLD",
	//MDY: "GEN REQ VI: PHYS WRLD",
	//MDZ: "GEN REQ VII: SCIENCE SECTOR",
	//MEM: "ALL READINGS AND LECTURES IN ENGLISH",
	MER: "ENGINEERING STUDENTS ONLY",
	MEV: "FOR WPWP CERTIFICATE STUDENTS ONLY",
	//MFA: "Fine Arts Library - Davis Seminar Room",
	//MFL: "FOREIGN LANG ACROSS CURRICULUM (FLAC) CRSE",
	MFO: "FOR FRESHMEN ONLY",
	MFP: "FRESHMEN AND SOPHOMORES ONLY",
	//MFR: "FORMAL REASONING COURSE",
	MFS: "FRESHMAN SEMINAR",
	MFW: "FRESHMAN JOSEPH WHARTON SCHOLARS STUDENTS ONLY",
	//MGC: "GREENFIELD INTERCULTURAL CENTER",
	MGH: "BENJAMIN FRANKLIN SEMINARS",
	MGL: "ONLY OPEN TO MLA-GLPS STUDENTS",
	MHC: "EXEC SMHC PROGRAM STUDENTS ONLY",
	MHD: "DEPARTMENTAL HONORS COURSE",
	//MHH: "HILLEL AUDITORIUM",
	MHO: "SECTION FOR HONORS STUDENTS",
	MHS: "FOR HUNTSMAN STUDENTS ONLY",
	MHY: "HYBRID COURSE ONLY",
	//MIB: "MSSP Requirement",
	//MIC: "Fulfills MSW Research Option",
	MID: "MSW Elective",
	//MIE: "Fulfills MSW Macro Practice Elective",
	//MIF: "Fulfills MSW Clinical Practice Elective",
	//MIG: "SP2 Ph.D. Requirement",
	//MIH: "Fulfills MSW Policy Option",
	MIN: "INTERNATIONAL COURSE",
	MIO: "FOR INTEGRATED STUDIES (ISP) STUDENTS ONLY",
	MIS: "INDEPENDENT STUDY COURSE",
	//MLB: "ATTENDANCE AT FIRST LAB MEETING REQUIRED",
	MLF: "LAB FEE $25.00",
	//MLI: "LAUDER INSTITUTE",
	MMA: "AUDITION REQUIRED",
	MMO: "MAJORS ONLY",
	MMT: "THIS SECTION FOR M&T STUDENTS ONLY",
	//MNP: "NO PRIOR LANGUAGE EXPERIENCE REQUIRED",
	MNU: "WILL NOT COUNT TOWARD UNDERGRADUATE DEGREES",
	MOF: "ONLINE COURSE FEE $150",
	MOL: "ONLINE COURSE ONLY",
	MPA: "SUBJECT TO APPROVAL OF COMMITTEE ON INSTR",
	//MPG: "PENN GLOBAL SEMINAR",
	MPH: "FOR PHD STUDENTS ONLY",
	//MPI: "Req PHYS LAB included in PHYS151 REG",
	MPL: "PRIOR LANGUAGE EXPERIENCE REQUIRED",
	//MPP: "DESIGNATED SNF PAIDEIA PROGRAM COURSE",
	//MPR: "DU BOIS HOUSE MULTIPURPOSE ROOM",
	MPS: "SECTION RESERVED FOR LPS STUDENTS ONLY",
	//MPY: "Req PHYS LAB included in PHYS150 REG",
	//MQS: "COLLEGE QUANTITATIVE DATA ANALYSIS REQ.",
	MRA: "ARTS HOUSE SEMINAR",
	MRB: "BUTCHER-SPEAKMAN HOUSE SEMINAR",
	MRC: "COMMUNITY HOUSE SEMINAR",
	MRD: "DU BOIS HOUSE SEMINAR",
	MRE: "EAST ASIA HOUSE SEMINAR",
	MRG: "HARRISON HOUSE SEMINAR",
	MRH: "HARNWELL HOUSE SEMINAR",
	MRI: "HILL HOUSE SEMINAR",
	MRK: "KINGS COURT/ENGLISH HOUSE SEMINAR",
	MRL: "LATIN AMERICA HOUSE SEMINAR",
	MRM: "MODERN LANGUAGE COLLEGE HOUSE SEMINAR",
	MRN: "INTERNATIONAL HOUSE SEMINAR",
	MRO: "HAMILTON COLLEGE HOUSE SEMINAR",
	MRP: "PROVOST TOWER SEMINAR",
	MRQ: "FISHER HASSENFELD COLLEGE HOUSE SEMINAR",
	//MR: "RECITATIONS WILL BE ASSIGNED AT FIRST LEC",
	MRR: "GREGORY COLLEGE HOUSE SEMINAR",
	MRS: "SPRUCE STREET COLLEGE HOUSE SEMINAR",
	MRT: "STOUFFER HOUSE SEMINAR",
	MRU: "UPPER QUAD SEMINAR",
	MRV: "VAN PELT COLLEGE HOUSE SEMINAR",
	MRW: "WARE COLLEGE HOUSE SEMINAR",
	MRY: "COMMUNITY SERVICE HOUSE SEMINAR",
	MRZ: "READING COURSE",
	MSB: "STUDY ABROAD COURSE",
	//MSG: "CONTACT DEPT or INSTRUCTOR FOR CLASSRM INFO",
	MSI: "SPEAKING INTENSIVE COURSE",
	MSL: "AN ACADEMICALLY BASED COMMUNITY SERV COURSE",
	MSO: "FOR MASTER STUDENTS ONLY",
	//MSQ: "SEE DEPT. FOR SECTION NUMBERS",
	//MSU: "COMMUNICATION WITHIN THE CURRICULUM",
	MTG: "GRADUATING SENIORS ONLY",
	MTJ: "SEATS RESERVED FOR SENIORS AND JUNIORS",
	MTS: "SEATS RESERVED FOR SENIORS",
	//MWA: "WATU PROGRAM - FULFILLS 1/2 COLLEGE WRT REQ",
	//MWB: "FULFILLS 1/2 COLLEGE WRITING REQUIREMENT",
	//MWC: "WRITING REQUIREMENT",
	MWD: "WHARTON DOCTORAL COURSE",
	MWE: "WHARTON EXECUTIVE MBA COURSE",
	MWH: "FOR WHARTON STUDENTS ONLY",
	//MWI: "WISTAR INSTITUTE AUDITORIUM",
	//MWL: "LITERATURES OF THE WORLD",
	//MWM: "CRITICAL WRITING IN THE MAJOR",
	//MWP: "WRITING ACROSS THE UNIVERSITY PROGRAM",
	//MWR: "WRITING COURSE",
	MWS: "JOSEPH WHARTON SCHOLARS ONLY",
	MWX: "WRITING SAMPLES REQUIRED",
	//MWZ: "WATU CREDIT OPTIONAL - SEE INSTRUCTOR",
	MYL: "YEAR LONG COURSE",
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
	//"Q&": "       CONTINUATION OF ABOVE QUOTA",
	QLM: "QUOTA, LIMIT SPECIFIED SEATS",
	QRS: "QUOTA, RESERVE SPECIFIED SEATS"
}

if (document.title == "Trade Proposals") {

$('#useridspan').html("<input class='hide' type='text' name='id' value='" + USER_ID + "'>")
$('#tradeproposalsList').html("<span style='color:green;'>Loading trade proposals...</span>")

if($('#user_id').text()!=""){
    sessionStorage.clear()
    USER_ID = $('#user_id').html()
    sessionStorage.setItem("user_id",USER_ID)
}

if(JSON.parse($('#redirect').text())) {
	window.location.replace('/tradeproposals')
}
else{
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
	$('#addtpbut').html("<input type='submit' value='Add Trade Proposal'><br>")
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
  htmlStuff +="'>&nbsp; <button onclick='window.location.href=\"/tradeproposals\"' type='button'>Cancel</button></div></form>"
	$('#tradeproposaldiv').html(htmlStuff);

  $('#tradeproposalform').submit(function(){
    if(tradeproposal.offerings.length == 0 || tradeproposal.requests.length == 0){
      alert("You must request at least one course and offer at least one course.")
      return false;
    }
    return true;
  })

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
      //courseData = courseData.filter(function(c){return !tradeproposal.offerings.includes(c["section_id_normalized"].replace(/\s/g,'')) && !tradeproposal.requests.includes(c["section_id_normalized"].replace(" ", "")) })
  		var requestedCourseNum = $('#course').val()
      var htmlStuff = "";
  		for (var i = 0; i < courseData.length; i++) {
  			var name = courseData[i]["section_id_normalized"].replace(/\s/g,'')
				var localCrosslistings = courseData[i]['crosslistings'].map(e=>{return e.subject+'-'+e.course_id+'-'+e.section_id}).filter(e=>{return e!=name})
				crossListedCourse = Object.entries(tradeproposal.crosslistings).reduce((r,e)=>{return (e[1].includes(name) ? e[0] : r)}, "")
				htmlStuff+="<br>"
				prevOf=tradeproposals.reduce((r,e,i)=>{if(i==tradeproposalnum){ return r; } return r||(e.offerings.includes(name)?name:"")||localCrosslistings.reduce((r1,e1)=>{return r1||(e.offerings.includes(e1)?e1:"")},"")},"")
				prevReq=tradeproposals.reduce((r,e,i)=>{if(i==tradeproposalnum){ return r; } return r||(e.requests.includes(name)?name:"")||localCrosslistings.reduce((r1,e1)=>{return r1||(e.requests.includes(e1)?e1:"")},"")},"")
				if(!(name in tradeproposal.crosslistings) && crossListedCourse=="" && prevOf=="" && prevReq==""){
					htmlStuff += "<span onclick=\"offerCourse('"+JSON.stringify(editing)+"', '"+name+"')\" style='border-radius: 5px; padding: 1px 2px 1px 2px; background-color: red; color:white; cursor: pointer;' >Give</span> <span onclick=\"requestCourse('"+JSON.stringify(editing)+"', '"+name+"')\" style='border-radius: 5px; padding: 1px 2px 1px 2px; background-color: green; color:white; cursor: pointer;'>Receive</span>&nbsp;"
				}
				if(name in tradeproposal.crosslistings){
					htmlStuff+= "<span>" + name + "</span><span style='color:green;'>&nbsp;(added to trade proposal)</span>"
				}
				else if(crossListedCourse != ""){
					htmlStuff+= "<span>" + name + "</span><span style='color:green;'>&nbsp;(crosslisted with "+crossListedCourse+")</span>"
				}
				else if(prevOf) {
					htmlStuff+= "<span onclick=\"offerCourse('"+JSON.stringify(editing)+"', '"+name+"')\" style='border-radius: 5px; padding: 1px 2px 1px 2px; background-color: red; color:white; cursor: pointer;' >Give</span>&nbsp; <span>" + name + "</span><span style='color:blue;'><br>(you are offering "+prevOf+(prevOf==name?"":(" = "+name))+" in another trade proposal)</span>"
				}
				else if(prevReq) {
					htmlStuff+= "<span onclick=\"requestCourse('"+JSON.stringify(editing)+"', '"+name+"')\" style='border-radius: 5px; padding: 1px 2px 1px 2px; background-color: green; color:white; cursor: pointer;'>Receive</span>&nbsp; <span>" + name + "</span><span style='color:blue;'><br>(you are requesting "+prevReq+(prevReq==name?"":(" = "+name))+" in another trade proposal)</span>"
				}
				else{
					htmlStuff+= "<span>" + name + "</span>"
				}
  		}
  		$('#results').html(htmlStuff)
    }
	}
}

var tradeproposalnum = -1;
var tradeproposals = [];
var tradeproposal = {
  offerings: [],
  requests: [],
	crosslistings: {}
};

function addCrossListings(name, courseDetails){
	tradeproposal.crosslistings[name] = courseDetails['crosslistings'].map(e=>{return e.subject+'-'+e.course_id+'-'+e.section_id}).filter(e=>{return e!=name})
}

function offerCourse(edstring, name){
  editing = JSON.parse(edstring)
	courseDetails = JSON.parse($('#api_data').text()).find(c => { return c["section_id_normalized"].replace(/\s/g,'') == name})
	var reqs = courseDetails["requirements"]
	var ucc = reqs.reduce(function(total, currentVal){ if(UCC.includes(currentVal.registration_control_code)){ return total.concat([currentVal.registration_control_code])} else{ return total } } , [])
	if(reqs.reduce(function(total, currentVal){ return total || UCC.includes(currentVal.registration_control_code) } , false)){ mesg = "This course cannot be traded.  It has the following unsupported permit requirement(s):\n\n"; ucc.forEach(e=>{ mesg += UCC_EXPL[e]+"\n"}); alert(mesg) }
  else{
		addCrossListings(name, courseDetails)
    tradeproposal.offerings.push(name)
    renderSearchResults(editing)
    renderTradeProposal(editing)
  }
}
function requestCourse(edstring, name){
  editing = JSON.parse(edstring)
	courseDetails = JSON.parse($('#api_data').text()).find(c => { return c["section_id_normalized"].replace(/\s/g,'') == name})
	var reqs = courseDetails["requirements"].filter(e=>{return (e.registration_control_code in UCC_EXPL)})
	var ucc = reqs.reduce(function(total, currentVal){ if(UCC.includes(currentVal.registration_control_code)){ return total.concat([currentVal.registration_control_code])} else{ return total } } , [])
	if(reqs.reduce(function(total, currentVal){ return total || UCC.includes(currentVal.registration_control_code) } , false)){ mesg = "This course cannot be traded.  It has the following unsupported permit requirement(s):\n\n"; ucc.forEach(e=>{ mesg += UCC_EXPL[e]+"\n"}); alert(mesg) }
  else{
		mesg = "Confirm that you are currently able to add this course, based on its permit requirements:\n\n"
		reqs.forEach(e=>{ mesg += UCC_EXPL[e.registration_control_code]+"\n"})
		if(reqs.length==0 || confirm(mesg)){
			addCrossListings(name, courseDetails)
	    tradeproposal.requests.push(name)
	    renderSearchResults(editing)
	    renderTradeProposal(editing)}
  }
}
function deselectCourse(edstring, name){
  editing = JSON.parse(edstring);
  tradeproposal.offerings = tradeproposal.offerings.filter(function(c){ return c != name });
  tradeproposal.requests = tradeproposal.requests.filter(function(c){ return c != name });
	delete tradeproposal.crosslistings[name]
  renderSearchResults(editing);
  renderTradeProposal(editing);
}

function searchFun(editing){
  dept = $('#dept').val().replace(/[^A-Za-z]/g, "").toUpperCase()
  $('#dept').val(dept)
  course = $('#course').val().replace(/[^0-9]/g, "")
  $('#course').val(course)
  section = $('#section').val().replace(/[^0-9]/g, "")
  $('#section').val(section)
  if(dept.length < 2 || dept.length > 4){ $('#dept').css('border-color', 'red'); setTimeout(function(){alert("Department code must have 2 to 4 letters.")}, 50); }
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
	tradeproposals = JSON.parse($('#tradeproposals').text());
	if ($("#edit-num").text() != "") {
		editing = true;
		tradeproposalnum = parseInt($('#edit-num').text());
		tradeproposal = tradeproposals[tradeproposalnum];
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
			alert("Please sign in with your UPenn email.")
		} else if (!(domain.includes("upenn.edu"))) {
			signOutHome()
			alert("Please sign in with your UPenn email.")
		} else {

			var queryString = ""

			queryString += "fname:"
			console.log("ID: " + profile.getId());
			console.log('Full Name: ' + profile.getName());
			console.log('Given Name: ' + profile.getGivenName());
			console.log('Family Name: ' + profile.getFamilyName());
			console.log("Image URL: " + profile.getImageUrl());
			console.log("Email: " + profile.getEmail());

			// The ID token you need to pass to your backend:
			var id_token = googleUser.getAuthResponse().id_token;

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
	$('#titlelink').attr('href', '/')

} else {
	$('#headerLoggedIn').removeClass('hide')
	$('#headerLogout').text("Sign Out")
	$('#headerLogout').css('display', 'block')
	$('#headerLogout').css('color', 'white')
	$('#headerLogout').click(signOut);
	$('#titlelink').attr('href', '/tradeproposals')
}
