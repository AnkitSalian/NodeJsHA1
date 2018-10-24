/*
 * Desc : Creating a node project, such that when someone post on /hello route app will show welcome msg
 * 
 * Author : Ankit Salian
 */

//Importing dependencies
var http = require('http');
var url = require('url');
var config = require('./config');
var StringDecoder = require('string_decoder').StringDecoder;

//Creating server
var server = http.createServer(function(req, res){

    var parseUrl = url.parse(req.url, true);
    //Get The path name
    var path = parseUrl.pathname;
    //Trim the path
    var trimUrl = path.replace(/^\/+|\/+$/g,'');
    //Get method name
    var method = req.method.toLowerCase();
    //Get the headers
    var headers = req.headers;
    //Get the params passed in URL
    var query = parseUrl.query;
    
    var decoder = new StringDecoder('utf-8');
    var buffer='';
    req.on('data',function(data){
        buffer += decoder.write(data);
    });
    req.on('end',function(){
        //Write the payload
        buffer += decoder.end();
        //Identfy the route        
        var chosenPath = typeof(route[trimUrl])!=='undefined' ? route[trimUrl] : handlers.notFound;

        var request = {
            trimUrl : trimUrl,
            query : query,
            method : method,
            headers : headers,
            'payload' : JSON.parse(buffer)
        };
        
        chosenPath(request, function(statusCode, msg){
            statusCode = typeof(statusCode)=='number' ? statusCode : 404;
            msg = typeof(msg)=='object' ? msg : '';
            var returnMsg = JSON.stringify(msg);
            res.setHeader('Content-Type','application/json');
            res.writeHead(statusCode);
            res.end(returnMsg);
            console.log('Response is',statusCode,returnMsg);
        });

    });
    
});

//Server listening on port mentioned by user, if not specified use default
server.listen(config.port, function(req, res){
    console.log('Server is listening on port',config.port,'in',config.envName);
});

//Creating handlers
var handlers = {};

//Handlers for hello
handlers.hello = function(data, callback){
    let msg = 'Welcome '+ data.payload.name;
    console.log('data===>',data.payload.name);
    callback(200, {'msg' : msg});
}

//Default hander for error msg
handlers.notFound = function(data, callback){
    let msg = 'Request not found';
    callback(400, { msg : msg });
}

//Creating route
var route = {
    'hello' : handlers.hello
};