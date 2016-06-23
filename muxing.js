var http        = require('http');
var express		= require('express');
var fs			= require('fs');
var io			= require('socket.io');

var app       	= express();
var staticDir 	= express.static;
var server    	= http.createServer(app);
var config  	= require('./config.json');

var presentationDir = __dirname + '/' + config.dir;
var presentationFile = presentationDir + '/' + config.file;

var muxingID = config.id;

function processFile(fileName, type) {
	var distName = fileName + '.' + type + '.html';
	
	try {
		var content = fs.readFileSync(fileName, 'utf8');
		if (!content) {
			console.log('read file ' + fileName + 'failed!');
			process.exit(1);
		}

		var output = content.substring(0, content.lastIndexOf("</body>"));
		output += '<script src="http://cdn.socket.io/socket.io-1.3.5.js"></script>\n';
		output += '<script>\n';
		output += '    var muxingID = "' + muxingID + '";\n';
		output += '    var socket = io.connect( "' + config.url+ '" ) ;\n';
		var pluginFile = __dirname + '/plugins/' + config.plugin + '/' + type + '.js';
		content = fs.readFileSync(pluginFile);
		if (!content) {
			console.log('read file ' + pluginFile + 'failed!');
			process.exit(1);
		}
	
		output += content + '\n</script>\n</body>\n</html>';
		
		fs.writeFileSync(distName, output);
	} catch (err) {
			console.log('err:' + err);
			process.exit(1);
	}
}

processFile(presentationFile, 'pre');
processFile(presentationFile, 'master');
io = io(server);

var opts = {
	port: process.env.PORT || config.port || 1948
};


io.on( 'connection', function( socket ) {
	socket.on('multiplex-statechanged', function(data) {
		socket.broadcast.emit(data.socketId, data);
	});
});

app.get("/", function(req,res) {
	res.redirect('/' + config.file + '.pre.html');
});

app.get("/m", function(req,res) {
	res.redirect('/' + config.file + '.master.html');
});

app.use('/', staticDir(__dirname + '/' + config.dir));

// Actually listen
server.listen( opts.port || null );

var brown = '\033[33m',
	green = '\033[32m',
	reset = '\033[0m';

console.log( brown + "Muxing" + reset + "running on port " + green + opts.port + reset );
console.log( brown + "Master: " + reset + green + config.url +  '/m' + reset );
console.log( brown + "Client: " + reset + green + config.url +  '/' + reset );
