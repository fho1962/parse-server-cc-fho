//Input:  'Classname'
//Output: 'Attribut List' or 'Error Message'
Parse.Cloud.define("checkNowServer", function(request, response) {

  Parse.Cloud.useMasterKey();
  var class_name = request.params.inClass;
  
   var query = new Parse.Query(class_name);
   query.count().then(function(count) {
     if (count == 0) {
       response.error("Class has no data or does not exist."); 
       return;       
     }
   }, function (error) {
     response.error("Class does not exist.");
     return;
   }).then(function() {
     query.first({
       success: function(result) {
         var attr_list = Object.getOwnPropertyNames(result.attributes);
         console.log("Attribute list found: " + attr_list)
         response.success(attr_list);
       },
       error: function(error) {
         response.error("Unknown Error on 'query.first'.");
       }
     });
   });
});

//Input:  'Classname', 'Attribute List', Comment
//Output: 'URL to file' or 'Error Message'
Parse.Cloud.define("downloadNowServer", function(request, response) {

  Parse.Cloud.useMasterKey();
  var class_name = request.params.inClass;
  var attr_list = request.params.inAttrList;
  var comment = request.params.inComment;
  
  var query = new Parse.Query(class_name);
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
    console.log(header_data);
    var download_string = header_data  + '\r';       
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
        d_file_rec.set("comment", comment);
        d_file_rec.set("file_pointer", parse_file);
        d_file_rec.setACL(new Parse.ACL(Parse.User.current()));
        d_file_rec.save().then(function() {
          console.log(parse_file.url());
          response.success(parse_file.url());
        });
      });
    });  
  });
});