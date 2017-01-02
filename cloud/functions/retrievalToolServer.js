//Input:  'Classname'
//Output: 'Attribut List' or 'Error Message'
Parse.Cloud.define("checkNowServer", function(request, response) {

  Parse.Cloud.useMasterKey();
  var class_name = request.params.inClass;
  
   var query = new Parse.Query(class_name);
   query.count().then(function(count) {
     if (count == 0) {
       console.log();
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
         response.success(attr_list);
       },
       error: function(error) {
         response.error("Unknown Error on 'query.first'.");
       }
     });
   });
});
