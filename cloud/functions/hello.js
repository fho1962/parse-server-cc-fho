Parse.Cloud.define('hello', function(req, res) {
  var dat = Date().valueOf();
  res.success('hello world: ' + dat);
});