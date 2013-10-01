
var async = require('async');
var api = require( '../api' );

module.exports = function( app ) {
	app.get( '/repos/:username', function ( request, response ) {
		var username = request.params.username;

		async.waterfall([
			function( callback ) {
				api.repos.getFromUser({
					user: username
				}, function( err, res ) {
					callback( null, res );
				});
			},
			function( res, callback ) {
				var repos = [];
				res.forEach( function( item ){
					repos.push( item.name );
				});
				callback( null, repos );
			}
		], function( err, repos ){

			var header = {
			  title: 'repos',
			  heading: username + '/repos',
			};

			if ( request.accepts('text/html') ) {

		  	response.render('repos', {
		      model: {
		        header: header,
		        username: username,
		        repos: repos
		      },
		      layout: 'layouts/default.hbs'
		  	});

		  }
		});

	});

}
