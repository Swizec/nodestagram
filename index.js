
var http = require('http'),
    https = require('https'),
    querystring = require('querystring');


function InstagramClient(client_id, client_secret) {
    this.client_id = client_id;
    this.client_secret = client_secret;

    this.media = new InstagramMediaClient(this);
    this.tags = new InstagramTagsClient(this);
}

InstagramClient.prototype.fetch = function (path, params, callback) {
    if (arguments.length == 3) {
	params.client_id = this.client_id;
    }else{
	var callback = params;
	params = {client_id: this.client_id};
    }

    var options = {
	host: 'api.instagram.com',
	path: path+'?'+querystring.stringify(params),
    }

    https.get(options, function (res) {
	var raw = "";
	res.on('data', function (chunk) {
	    raw += chunk;
	});
	res.on('end', function () {
	    var response = JSON.parse(raw);

	    if (response['meta']['code'] == 200) {
		callback(response['data'], null);
	    }else{
		callback(response['meta'], response['meta']['code']);
	    }
	});
    });    
}

function InstagramMediaClient(parent) {
    this.parent = parent;
}

InstagramMediaClient.prototype.id = function (id, callback) {
    this.parent.fetch('/v1/media/'+id, callback);
};

InstagramMediaClient.prototype.popular = function (callback) {
    this.parent.fetch('/v1/media/popular/', callback);
}

InstagramMediaClient.prototype.search = function (parameters, callback) {
    this.parent.fetch('/v1/media/search/', parameters, callback);
}

function InstagramTagsClient (parent) {
    this.parent = parent;
}

InstagramTagsClient.prototype.search = function (query, callback) {
    this.parent.fetch('/v1/tags/search/',
		      {q: query},
		      callback);
}

InstagramTagsClient.prototype.media = function (tag, params, callback) {
    if (arguments.length < 3) {
	var callback = params;
	params = {};
    }

    this.parent.fetch('/v1/tags/'+tag+'/media/recent/',
		      params,
		      callback);
}

InstagramTagsClient.prototype.tag = function (tag, callback) {
    this.parent.fetch('/v1/tags/'+tag, callback);
}

exports.createClient = function (client_id, client_secret) {
    var instagram_client = new InstagramClient(client_id, client_secret);

    return instagram_client;
}
