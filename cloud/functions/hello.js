Parse.Cloud.define('hello', function(req, res) {
  var myParm = request.params.myString;
  res.success('hello world' + myParm);
});