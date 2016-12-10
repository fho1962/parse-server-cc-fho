Parse.Cloud.define('hello', function(req, res) {
  var dat = Date().getTime();
  res.success('hello world: ID-' + dat);
});