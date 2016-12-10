Parse.Cloud.define('hello2', function(req, res) {
  var d = Math.floor((Math.random() * 1000000000000) + 1);
  res.success('hello world: ' + d);
});