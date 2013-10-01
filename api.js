
module.exports = function() {

	var GitHubApi = require( 'github' );

	var github = new GitHubApi({
	  version: '3.0.0',
	  timeout: 5000
	})

	github.authenticate({
		type: 'oauth',
		token: 'e0c0457cdc7c5ebc783e616484aefcc0fd661258'
	});

	return github;

}();
