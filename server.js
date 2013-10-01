
var http 		= require( 'http' );
var express = require( 'express' );
var hbs 		= require( 'express-hbs' );
var socket	= require( 'socket.io' );
var path 		= require( 'path' );

var app 		= express();
var server 	= http.createServer( app );
var port 		= process.env.PORT || 5000;

app.engine( 'hbs', hbs.express3( {
  partialsDir: __dirname + '/views/partials',
  layoutsDir: __dirname + '/views/layouts',
  contentHelperName: 'content',
}));
app.set( 'views', __dirname + '/views' );
app.set( 'view engine', 'hbs' );
app.use( express.bodyParser() );
app.use( express.methodOverride() );
app.use( app.router );
app.use( express.static( path.join( __dirname, 'public' ) ) );

if ( 'development' == app.get( 'env' ) ) {
  app.use( express.logger() );
  app.use( express.errorHandler() );
}

server.listen( port, function() {
  console.log( 'Listening on ' + port );
});

var io = socket.listen( server );

require( './routes' )( app, io );
