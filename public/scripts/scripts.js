var USER_ID = sessionStorage.getItem("user_id");





if (document.title == "PCA+ Alerts") {



if($('#user_id').text()!=""){
    sessionStorage.clear()
    USER_ID = $('#user_id').html()
    sessionStorage.setItem("user_id",USER_ID)
}

if($('#alerts').text()==""){
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    $('#alerts').text(this.responseText)
    finishPopulatingAlerts();
  }
};
xhttp.open("GET", "/alertsInfo?id="+USER_ID, true);
xhttp.send();
}
else{
finishPopulatingAlerts();
}

}
function finishPopulatingAlerts(){
  var alertsArray = JSON.parse($('#alerts').text())
  var alertsListHTML="<input type='text' name='id' value='"+USER_ID+"' class='hide'><table><tr><th>Classes</th><th>Settings</th><th>Actions</th></tr>"
  for(var i = 0; i<alertsArray.length ; i++){
    if(alertsArray[i]["settings"]["autodelete"]){
    alertsListHTML+="<tr><td><div class='tableDiv'>"+alertsArray[i]["classes"]+"</div></td><td><div class='tableDiv'>Autodelete: enabled</div></td><td><div class='tableDiv'><button type='submit' name='edit' value="+i+">Edit</button><button type='submit' name='delete' value="+i+">Delete</button><button type='submit' name='test' value="+i+">Test</button></div></td></tr>"
}
else{
  alertsListHTML+="<tr><td><div class='tableDiv'>"+alertsArray[i]["classes"]+"</div></td><td><div class='tableDiv'>Autodelete: disabled</div></td><td><div class='tableDiv'><button type='submit' name='edit' value="+i+">Edit</button><button type='submit' name='delete' value="+i+">Delete</button><button type='submit' name='test' value="+i+">Test</button></div></td></tr>"

}
  }
  alertsListHTML+="</table>"

  $('#alertsList').html(alertsListHTML)
}


function toggle(source) {
  checkboxes = document.getElementsByClassName('classes');
  for(var i=0, n=checkboxes.length;i<n;i++) {
    checkboxes[i].checked = source.checked;
  }
}

var jcalData="";

var openFile = function(event) {
  var input = event.target;

  var reader = new FileReader();
  reader.onload = function(){
    var text = reader.result;

    jcalData = ICAL.parse(text);
    $('#jcal').val(JSON.stringify(jcalData))
    var t = JSON.parse(JSON.stringify(jcalData))
console.log(jcalData[2][0/*0-17*/][1])
    /*var node = document.getElementById('output');
    node.innerText = text;
    console.log(reader.result.substring(0, 200));*/
  };
  reader.readAsText(input.files[0]);

}

if(document.title == "PCA+ New Alert"){

if($('#api_data').html()!=""){

courseData=JSON.parse($('#api_data').html())

courseData.sort(function(a,b){
  return parseInt(a["course_number"])-parseInt(b["course_number"])
})

var htmlStuff=""
var editing = ($('#edit-settings').text()!="")
if(editing){
  htmlStuff="<form action='/updateAlert' method='get'><input class='hide' type='text' name='num' value='"+$('#edit-num').text()+"'><input type='checkbox' onClick='toggle(this)' checked /> Toggle All<br/>___________<br><br>"
}
else{
  htmlStuff="<form action='/setAlert' method='get'><input type='checkbox' onClick='toggle(this)' /> Toggle All<br/>___________<br><br>"

}

var requestedCourseNum=$('#course').val()

for(var i =0; i<courseData.length;i++){
  courseNameNum=courseData[i]["course_id"].replace(" ","-")
  if(matchesFunc(requestedCourseNum, courseData[i]["course_number"])){
    if(editing){
      htmlStuff+="<input type='checkbox' id="+courseNameNum+" name='classes' class='classes' value="+courseNameNum+" checked > "+courseNameNum+"<br/>"

    }
    else{
    htmlStuff+="<input type='checkbox' id="+courseNameNum+" name='classes' class='classes' value="+courseNameNum+"> "+courseNameNum+"<br/>"
  }
  }
}
if(editing){
  if(JSON.parse($('#edit-settings').text())["autodelete"]){
  htmlStuff+="<input class='hide' type='text' name='formID' value='"+USER_ID+"'>___________<br><br>Autodelete course from notification group upon alert: <input type='checkbox' id='autodelete' name='autodelete' checked><br><br><input type='submit' value='Update Alert'></form>"}
  else{
htmlStuff+="<input class='hide' type='text' name='formID' value='"+USER_ID+"'>___________<br><br>Autodelete course from notification group upon alert: <input type='checkbox' id='autodelete' name='autodelete'><br><br><input type='submit' value='Update Alert'></form>"
  }

}
else{
  htmlStuff+="<input class='hide' type='text' name='formID' value='"+USER_ID+"'>___________<br><br>Autodelete course from notification group upon alert: <input type='checkbox' id='autodelete' name='autodelete'><br><br><input type='submit' value='Create Alert'></form>"

}

$('#results').html(htmlStuff)



//console.log(courseData)
}





}



function matchesFunc(query, toBeSearched){
  subSearched=toBeSearched.substring(0,query.length)
  return (subSearched===(query))
}

if(document.title == "PCA+ User Details"){

//$('#calendar').on('change', function(){})

//console.log($('#calendar'))

  if($('#user_id').text()!=""){
      sessionStorage.clear()
      USER_ID = $('#user_id').text()
      sessionStorage.setItem("user_id",USER_ID)

  }

  $('#formID').val(USER_ID)

}



  if(USER_ID == null && document.title != "PennCourseAlert+" && document.title != "PCA+ About"){
    console.log("scripts.js 122: USER_ID == NULL")
    signOut()
  }






function onSignIn(googleUser) {

  if($('#logout').text()=="true"){
    /*var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log('User signed out.');
    });*/
    var id_token = googleUser.getAuthResponse().id_token;

     var auth2 = gapi.auth2.getAuthInstance();
     auth2.disconnect();
     //if this did not had time to sign out put below lines in setTimeout to make a delay
     $('#google_token').val(id_token); //hidden form value
     $('#google-oauth').submit(); //hidden form
     $('#logout').text("")

  }
  else{
  // Useful data for your client-side scripts:
  var profile = googleUser.getBasicProfile()
  var domain = googleUser.getHostedDomain()
  if(typeof domain == "undefined"){
    signOutHome()
    //deleteAllCookies();
     alert("Please sign in with your UPenn email.")
  }
  else if(!(domain.includes("upenn.edu") || domain.includes("trinityschoolnyc.org"))){
    signOutHome()
     alert("Please sign in with your UPenn email.")
  }
  else{

  var queryString = ""

  queryString+="fname:"
  console.log("ID: " + profile.getId()); // Don't send this directly to your server!
  console.log('Full Name: ' + profile.getName());
  console.log('Given Name: ' + profile.getGivenName());
  console.log('Family Name: ' + profile.getFamilyName());
  console.log("Image URL: " + profile.getImageUrl());
  console.log("Email: " + profile.getEmail());

  // The ID token you need to pass to your backend:
  var id_token = googleUser.getAuthResponse().id_token;



//(sessionStorage.getItem("id_token") == null)//checks if signedIn

  post('/users/', {"id_token": id_token});//

  console.log("ID Token: " + id_token);

  }
}
}

function signOutHome(){
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    console.log('User signed out.');
  });
}

function signOut() {
    sessionStorage.clear()
    window.location="/logout";
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
        'prompt':'select_account'
      });

    }



function post(path, params, method='post') {

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

if(!USER_ID){
  $('#headerLoggedIn').addClass('hide')
  $('#headerLogout').css('display','none')
  $('#headerLogout').text("Sign Out")

}
else{
  $('#headerLoggedIn').removeClass('hide')
  $('#headerLogout').text("Sign Out")
  $('#headerLogout').css('display','block')
  $('#headerLogout').css('color','white')
  $('#headerLogout').click(signOut);
}
