
var http = require('http'),
    https = require('https'),
    querystring = require('querystring');


function InstagramClient(client_id, client_secret) {
    this.client_id = client_id;
    this.client_secret = client_secret;

    this.media = new InstagramMediaClient(this);
    this.tags = new InstagramTagsClient(this);
}

InstagramClient.prototype.fetch = function (options, callback) {
    options.host = options.host || 'api.instagram.com';

    https.get(options, function (res) {
	var raw = "";
	res.on('data', function (chunk) {
	    raw += chunk;
	});
	res.on('end', function () {
	    var response = JSON.parse(raw);

	    callback(response);
	});
    });    
}

function InstagramMediaClient(parent) {
    this.parent = parent;
}

InstagramMediaClient.prototype.id = function (id, callback) {
    var options = {
	path: '/v1/media/'+id+'?client_id='+this.parent.client_id
    };

    this.parent.fetch(options, function (response) {
	if (response['meta']['code'] == 200) {
	    callback(response['data'], null);
	}else{
	    callback(response['meta'], response['meta']['code']);
	}
    });
};

InstagramMediaClient.prototype.popular = function (callback) {
    var options = {
	path: '/v1/media/popular/?client_id='+this.parent.client_id
    };

    this.parent.fetch(options, function (response) {
	if (response['meta']['code'] == 200) {
	    callback(response['data'], null);
	}else{
	    callback(response['meta'], response['meta']['code']);
	}
    });
}

InstagramMediaClient.prototype.search = function (parameters, callback) {
    parameters['client_id'] = this.parent.client_id;

    var options = {
	path: '/v1/media/search/?'+querystring.stringify(parameters)
    }
    this.parent.fetch(options, function (response) {
	if (response['meta']['code'] == 200) {
	    callback(response['data'], null);
	}else{
	    callback(response['meta'], response['meta']['code']);
	}
    });
}

function InstagramTagsClient (parent) {
    this.parent = parent;
}

InstagramTagsClient.prototype.search = function (query, callback) {
    var options = {
	path: '/v1/tags/search/?q='+query+'&client_id='+this.parent.client_id
    }

    this.parent.fetch(options, function (response) {
	if (response['meta']['code'] == 200) {
	    callback(response['data'], null);
	}else{
	    callback(response['meta'], response['meta']['code']);
	}
    });
}


exports.createClient = function (client_id, client_secret) {
    var instagram_client = new InstagramClient(client_id, client_secret);

    return instagram_client;
}
