Parse.Cloud.define('hello2', function(req, res) {
  var d = Date();
  res.success('hello world: ' + d.getTime());
});