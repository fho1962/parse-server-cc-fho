  var u_id;
  var u_pw;
  var u_email;
  var c_name;
  var attr_list;
  var r_count;
  var download_string;
   
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
     //if(!checkUser(u_email)) {
     //  document.getElementById("ok_class").style.display = "none";
     //  document.getElementById("error_class").innerHTML = "Please login first";
     //  document.getElementById("error_class").style.display = "block";
     //  return;
     //}
     var class_name = document.getElementById("class_name").value;
     Parse.Cloud.run("checkNowServer", {inClass: class_name}, { 
       success: function (response) {
         console.log(response);
         attr_list = response;
         c_name = class_name;
     }, 
       error: function (err) {
         document.getElementById("ok_class").style.display = "none";
         document.getElementById("error_class").innerHTML = class_name + ": " + err;
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
     
     attr_list = getSelectedOptions(document.getElementById("attr_sel"));
        
     var query = new Parse.Query(c_name);
     query.count().then(function(count) {
       r_count = count;
     }).then(function() {
       //header row
       var header_data = "";
       for (j = 0; j < attr_list.length; j++) {
         if (j != 0) {
           header_data = header_data + "|";
         }
         header_data = header_data + attr_list[j];
       }
       console.log("header: " + header_data);
       download_string = header_data  + '\r';       
       // data rows / content collection
       var row_data;
       query.each(function(result) {
         row_data = "";
         for (var j = 0; j < attr_list.length; j++) {
           if (j != 0) {
             row_data = row_data + "|";
           }
           row_data = row_data + result.get(attr_list[j]);
         }
         console.log(row_data);
         download_string = download_string + row_data + '\r';
       }).then(function() { 
         var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9+/=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/rn/g,"n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}
         var base64string = Base64.encode(download_string);
         var parse_file = new Parse.File("download.csv", { base64: base64string });
         parse_file.save().then(function() {
           var D_file_rec = Parse.Object.extend("Download_files");
           var d_file_rec = new D_file_rec();
           d_file_rec.set("comment", document.getElementById("user_comment").value);
           d_file_rec.set("file_pointer", parse_file);
           d_file_rec.setACL(new Parse.ACL(Parse.User.current()));
           d_file_rec.save().then(function() {
             document.getElementById("error_download").style.display = "none";
             document.getElementById("ok_download").innerHTML = "Class '" + c_name + "' downloaded - see link below:";
             document.getElementById("ok_download").style.display = "block";
             document.getElementById("download_link").href = parse_file.url();
             document.getElementById("link_download").style.display = "block";
           });
         });
       });  
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
  