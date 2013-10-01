
var async 		= require('async');
var fs 				= require('fs-extra');
var sys 			= require('sys');
var exec 			= require('child_process').exec;

var api 			= require( '../api' );

module.exports = function( app, io ) {

	app.get( '/build/:username/:repo', function ( request, response ) {
		var username = request.params.username;
		var repo = request.params.repo;

		var header = {
		  title: 'build',
		  heading: 'build',
		};

		if ( request.accepts('text/html') ) {
	  	response.render('build', {
	      model: {
	        header: header
	      },
	      layout: 'layouts/default.hbs',
	  	});
	  }

		io.sockets.on( 'connection', function ( socket ) {
			async.waterfall([
				function( callback ) {
					fs.remove( 'src', function( err ){
						callback( null );
					});
				},
				// function( callback ) {
				// 	api.repos.fork({
				// 		user: username,
				// 		repo: repo
				// 	}, function(err, res){
				// 		var status = 'fork complete';
				// 		socket.emit( 'step', {
				// 			id: 'fork',
				// 			status: status
				// 		});
				// 		callback( null );
				// 	});
				// },
				function( callback ) {
					api.repos.get({
				    user: "iancrowther",
				    repo: repo
					}, function(err, res) {
						var url = res.clone_url
						callback( null, url );
					});
				},
				function( url, callback ) {
					exec("git clone " + url + " src", function (error, stdout, stderr) {
						var status = 'clone complete';

						sys.print( 'stdout: ' + stdout);
						sys.print( 'stderr: ' + stderr);

						socket.emit( 'step', {
							id: 'clone',
							status: status
						});

						callback( null );
					});
				},
				function( callback ) {
					fs.copy( 'build', 'src', function(err){
				    callback( null );
					});
				},
				function( callback ) {
					exec("cd ./src && grunt", function (error, stdout, stderr) {
						var status = 'build complete';

						sys.print( 'stdout: ' + stdout);
						sys.print( 'stderr: ' + stderr);

						socket.emit( 'step', {
							id: 'build',
							status: status
						});

						callback( null );
					});
				},
				function( callback ){
					exec("cd src && git add dist/scripts.min.js && git commit -m 'dist' && git push", function (error, stdout, stderr) {
						sys.print( 'stdout: ' + stdout);
						sys.print( 'stderr: ' + stderr);

						callback( null );
					});
				},
				function( callback ) {
					api.pullRequests.create({
					  user: username,
				    repo: repo,
				    title: "deployer",
				    body: "do not pull this in!",
				  	head: "iancrowther:master",
				  	base: "master"
					}, function(err, res){
						var status = 'pull complete';

						socket.emit( 'step', {
							id: 'pull',
							status: status
						});

						callback( null, res );

					});
				}
			], function( err, pull ){

				socket.emit( 'complete', {
					id: 'complete',
					url: pull.html_url
				});

			});
		});
	});

}
