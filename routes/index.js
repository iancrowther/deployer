
var api = require( '../api' );

module.exports = function( app, io ) {

	app.get( '/', function ( request, response ) {

		var header = {
		  title: 'deployer',
		  heading: 'deployer',
		};

		if ( request.accepts('text/html') ) {

	  	response.render('index', {
	      model: {
	        header: header
	      },
	      layout: 'layouts/default.hbs'
	  	});

	  }

	});

	app.post( '/', function( request, response ){

		response.redirect( '/repos/' + request.body.username );

	});

	var repos = require( './repos' )( app );
	var build = require( './build' )( app, io );
	var complete = require( './complete' )( app );
}
