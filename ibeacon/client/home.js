
var si = new ServerInterface('localhost',8090);

var loggedInUser = null;

function Login()
{
  window.status=('Attempting to Login to user area.');

  var username = document.getElementById("username").value;
  var password = document.getElementById("pwd").value;

  console.log(`info: ${username}, ${password}`);
  if (username === "" || password === "")
  {
    alert('\nERROR\nYou must enter BOTH username and password\n');
    window.status=('Missing data or Invalid. Check spelling and Ensure Names are in Correct Case.')
  }
  else
  {
    si.authorizeUser(username,password,function(res){
      console.log("server response: " + res );
      var res_json = JSON.parse(res);
      if(res_json.error){
        alert(res_json.error);
      }else{
        //logged in
        loggedInUser = username;
        document.cookie = "username=John Doe; expires=Thu, 18 Dec 2013 12:00:00 UTC; path=/";

        //change symbol
        var loginButton = document.getElementById("top-right-button2")
        var loginSpan = loginButton.firstElementChild;
        loginButton.textContent = "Sign out ";
        loginButton.appendChild(loginSpan);

        //reset content div
        var contentDiv = document.getElementsByClassName("container text-center")[0];
        var parent = contentDiv.parentNode;
        contentDiv.remove();
        var newChild = document.createElement("div");
        newChild.className = "container";
        parent.appendChild(newChild);

        // welcome message
        var head = document.createElement("h3");
        head.textContent = `Hello, ${loggedInUser}`;
        newChild.appendChild(head);

        // table
        var responsibleTable = document.createElement("div");
        responsibleTable.className = "table-responsive";

        contentDiv.appendChild(responsibleTable);
        var table = document.createElement("table");
        table.className = "table";
        responsibleTable.appendChild(table);
      }


        // func1(function(){
        //   var e = document.getElementById("top-right-button2");
        //   var c = e.firstElementChild;
        //
        //   e.textContent = "Sign out ";
        //   e.append(c);
        //   loggedInUser = username;
        // });
    });
  }
}

function CreateNewUser(){
  var username = document.iAccInput.iName.value;
  var password = document.iAccInput.iAccID.value;

  if (username === "" || password === "")
  {
    alert('\nERROR\nYou must enter BOTH username and password\n');
    window.status=('Missing data or Invalid. Check spelling and Ensure Names are in Correct Case.')
  }else{
    si.createUser(username,password,function(res){
      console.log("server response: " + res );
      var res_json = JSON.parse(res);
      if(res_json.error){
        alert(res_json.error);
      }else{
        alert(res_json.msg);
      }
    });
  }
}

function getMap(){
  var mapid = document.requestMapForm.mapid.value;
  if(mapid){
    si.getMapAndBeacons(mapid,function(res){
      var res_json = JSON.parse(res);
      if(res_json.error){
        alert(res_json.error);
      }else{
        document.querySelector('#responseParagraph').textContent = res;
      }
    })
  }else{
    alert("please enter mapid");
  }
}

function getMapVersion(){
  var mapid = document.requestMapForm.mapid.value;
  if(mapid){
    si.getMapVersion(mapid,function(res){
      var res_json = JSON.parse(res);
      if(res_json.error){
        alert(res_json.error);
      }else{
        document.querySelector('#responseParagraph').textContent = res_json.version;
      }
    })
  }else{
    alert("please enter mapid");
  }

}
