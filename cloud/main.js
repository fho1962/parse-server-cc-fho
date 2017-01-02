//require("./functions/hello");
require("./functions/hello1");
require("./functions/hello2");
require("./functions/resetPlayerNotes");

// require("./triggers/testObject");
// require("./triggers/player");

Parse.Cloud.define('hello', function(req, res) {
  res.success('hello world');
});


