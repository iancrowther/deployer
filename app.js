var express = require("express");
var app = express();
app.use(express.logger());

var GitHubApi = require("github");

var github = new GitHubApi({
    // required
    version: "3.0.0",
    // optional
    timeout: 5000
});


// http://nodejs.org/api.html#_child_processes
var sys = require('sys')
var exec = require('child_process').exec;
var child;

app.get('/', function(request, response) {
  response.send('Hello World!');
});

app.get('/github', function(request, response) {
	var url;

  github.repos.get({
	    user: "iancrowther",
	    repo: "yarwood"
	}, function(err, res) {
	    // var data = JSON.stringify(res);
	    url = res.clone_url
	});

	child = exec("git clone " + url, function (error, stdout, stderr) {
		sys.print('stdout: ' + stdout);
		sys.print('stderr: ' + stderr);
		if (error !== null) {
			console.log('exec error: ' + error);
		}
	});

  response.send('Github Checkout!');
});

app.get('/grunt', function(request, response) {
  child = exec("cd ./src && grunt", function (error, stdout, stderr) {
		sys.print('stdout: ' + stdout);
		sys.print('stderr: ' + stderr);
		if (error !== null) {
			console.log('exec error: ' + error);
		}
	});

  response.send('Grunt Yo!');
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});