Parse.Cloud.define('hello', function(req, res) {
  var d = Date();
  res.success('hello world: ' + d.getTime());
});