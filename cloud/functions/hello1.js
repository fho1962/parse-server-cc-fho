Parse.Cloud.define('hello1', function(req, res) {
  var datum = Date().valueOf();
  res.success('hello world: ' + datum);
});