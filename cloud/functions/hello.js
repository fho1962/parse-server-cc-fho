Parse.Cloud.define('hello', function(req, res) {
  var myParm = req.params.myString;
  res.success('hello world' + myParm);
});