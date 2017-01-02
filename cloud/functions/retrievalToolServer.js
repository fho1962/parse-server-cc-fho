//Input:  'Classname'
//Output: 'Attribut List' or 'Error Message'
Parse.Cloud.define("checkNowServer", function(request, response) {

  Parse.Cloud.useMasterKey();
  var class_name = req.params.inClass;
  
   var query = new Parse.Query(class_name);
   query.count().then(function(count) {
     if (count == 0) {
       response.error("Class has no data."); 
       return;       
     }
   }, function (error) {
     response.error("Class does not exist.");
     return;
   }).then(function() {
     query.first({
       success: function(result) {
         var attr_list = Object.getOwnPropertyNames(result.attributes);
         response.error(attr_list);
       },
       error: function(error) {
         response.error("Class does not exist.");
       }
     });
   });
});
