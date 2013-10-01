
module.exports = function( app ) {

	app.get( '/complete/:url', function ( request, response ) {

		if ( request.accepts('text/html') ) {

			var url = request.params.url;

	  	var header = {
			  title: 'complete',
			  heading: 'complete',
			};

	  	response.render('complete', {
	      model: {
	        header: header,
	        url: url
	      },
	      layout: 'layouts/default.hbs'
	  	});

	  }

	});

};
