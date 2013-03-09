var http = require('http');
var connect = require('connect');
var queryDecryptor = require('../index').queryDecryptor;
var crypto = require('crypto');
var querystring = require('querystring');

var decryptedData = 'lkaasssssssssssslkj123l; 1-190-9-12390- -12-912!@#!@#@#|!|||!|!|!|!@#P{{{}{}sss';
var password = 'shhhhh';

// the server
var server = connect()
		.use(connect.logger())
		.use(connect.query())		
		.use(queryDecryptor('p', password, {debug:true }))
		.use('/foo', function(request, response) {
			
			if (request.query.p !== decryptedData)	{
				console.log('server failed to depcrypt data - oops!!!');
				response.writeHead(500);
				response.end();
			}

			console.log('server got ' + request.query.p); //prints the value of decryptedData		
			response.end();
		}).listen(3000);	

server.on('listening', function() {
	
	console.log('server is listening');
	
	//
	// client simulation
	//
	var cipher = crypto.createCipher('aes192', password);

	var encryptedData = cipher.update(decryptedData, 'ascii', 'base64');

	encryptedData += cipher.final('base64');
	
	var url = 'http://localhost:3000/foo?p=' + encodeURIComponent( encryptedData );
	
	console.log('client requesting url ' + url);

	http.get(url, function(response) {
		
		if (response.statusCode === 200)
			console.log('ALL IS WELL!!')
		else
			console.log('oops something went wrong');

		server.close();
		process.exit(0);
	});	
	//
	// end client simulation
	//
});

