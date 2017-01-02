  var u_id;
  var u_pw;
  var u_email;
  var c_name;
   
   function logOnNow() {
     u_id = document.getElementById("user_id").value
     u_pw = document.getElementById("user_pw").value
     Parse.User.logIn (u_id,u_pw).then(function(user) {
       document.getElementById("error_user").style.display = "none";
       document.getElementById("ok_user").innerHTML = "User '" + document.getElementById("user_id").value + "' is logged in";
       document.getElementById("ok_user").style.display = "block";
       //console.log(user.attributes.email);
       u_email = Parse.User.current().attributes.email;
     }, function error(err) {
       Parse.User.logOut();
       document.getElementById("ok_user").style.display = "none";
       document.getElementById("error_user").innerHTML = "Login failed";
       document.getElementById("error_user").style.display = "block";
       u_email = "";
     });
   }
   
   function checkNow() {     
     if(!checkUser(u_email)) {
       document.getElementById("ok_class").style.display = "none";
       document.getElementById("error_class").innerHTML = "Please login first";
       document.getElementById("error_class").style.display = "block";
       return;
     }
     var class_name = document.getElementById("class_name").value;
     Parse.Cloud.run("checkNowServer", {inClass: class_name}, { 
       success: function (response) {
         console.log(response);
         attr_list = response;
         c_name = class_name;
     }, 
       error: function (err) {
         console.log(err);
         var selBox = document.getElementById("attr_sel");
         var selBoxLen = selBox.length;
         for (i = selBoxLen; i > 0;  i--) {
           selBox.removeChild(selBox.options[i-1]);
         }
         document.getElementById("ok_class").style.display = "none";
         document.getElementById("error_class").innerHTML = "Class '" + class_name + "': " + err.message + " code(" + err.code + ")";
         document.getElementById("error_class").style.display = "block";
         return;
      }
     }).then(function() {
       //attr_list = Object.getOwnPropertyNames(result.attributes);
       var selBox = document.getElementById("attr_sel");
       var selBoxLen = selBox.length;
       for (i = selBoxLen; i > 0;  i--) {
         selBox.removeChild(selBox.options[i-1]);
       }
       for (i = 0; i < attr_list.length; i++) {
         var doc_e = document.createElement("option");
         doc_e.setAttribute("value", attr_list[i]);
         var doc_t = document.createTextNode(attr_list[i]);
         doc_e.appendChild(doc_t);
         selBox.appendChild(doc_e);
       }
       document.getElementById("error_class").style.display = "none";
       document.getElementById("ok_class").innerHTML = "Class '" + c_name + "' is available";
       document.getElementById("ok_class").style.display = "block";
     });  
  }  
   
   function downloadNow() {
     if(!checkUser(u_email)) {
       document.getElementById("ok_download").style.display = "none";
       document.getElementById("error_download").innerHTML = "Please login first";
       document.getElementById("error_download").style.display = "block";
       return;
     }
     
     var attr_list = getSelectedOptions(document.getElementById("attr_sel"));
     var comment = document.getElementById("user_comment").value;
     Parse.Cloud.run("downloadNowServer", {inClass: c_name, inAttrList: attr_list, inComment: comment}, { 
       success: function (response) {
         console.log(response);
         document.getElementById("download_link").href = response;
         document.getElementById("link_download").style.display = "block";
         document.getElementById("error_download").style.display = "none";
         document.getElementById("ok_download").innerHTML = "Class '" + c_name + "' ready for download - link below:";
         document.getElementById("ok_download").style.display = "block";
       }, 
       error: function (err) {
         console.log(err);
         document.getElementById("ok_download").style.display = "none";
         document.getElementById("error_download").innerHTML = "Class '" + class_name + "': " + err.message + " code(" + err.code + ")";
         document.getElementById("error_download").style.display = "block";
         return;
       }
     });
   }
   
   function initThings() {
     <!-- Parse server config - initialize --> 
     Parse.initialize("myAppID-FF09EF7AD06890EE");
     Parse.serverURL = 'https://parse-server-cc-fho.herokuapp.com/parse';
     <!-- Initially hide diagnostic elements -->
     document.getElementById("ok_user").style.display = "none";
     document.getElementById("error_user").style.display = "none";
     document.getElementById("ok_class").style.display = "none";
     document.getElementById("error_class").style.display = "none";
     document.getElementById("ok_download").style.display = "none";
     document.getElementById("error_download").style.display = "none";
     document.getElementById("link_download").style.display = "none";
   }
   
   // arguments: reference to select list - copied and adopted from: http://www.dyn-web.com/tutorials/forms/select/multi-selected.php
    function getSelectedOptions(sel) {
      var opts = [], opt;
      // loop through options in select list
      for (var i=0, len=sel.options.length; i<len; i++) {
        opt = sel.options[i];    
        // check if selected
        if ( opt.selected ) {
            // add to array of option elements VALUES to return from this function
            opts.push(opt.value);
        }
      }
    // return array containing VALUES of selected option elements
    return opts;
  }
  
  function checkUser(email) {
      if (!Parse.User.current()) {
        return false;
      }
      if (!email) {
        return false;
      }
      if (email.substr(email.length - 15) == "@innovate-it.ch") {
        return true;
      }
      if (email.substr(email.length - 11) == "@juhomi.com") {
        return true;
      }
      return false;
  }
  