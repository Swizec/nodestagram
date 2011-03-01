
var http = require('http'),
    https = require('https');


function InstagramClient(client_id, client_secret) {
    this.client_id = client_id;
    this.client_secret = client_secret;

    this.media = new InstagramMediaClient(this);
}

function InstagramMediaClient(parent) {
    this.parent = parent;
}

InstagramMediaClient.prototype.id = function (id, callback) {
    var options = {
	host: 'api.instagram.com',
	path: '/v1/media/'+id+'?client_id='+this.parent.client_id
    };

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
};

InstagramMediaClient.prototype.popular = function (callback) {
    var options = {
	host: 'api.instagram.com',
	path: '/v1/media/popular/?client_id='+this.parent.client_id
    };
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

exports.createClient = function (client_id, client_secret) {
    var instagram_client = new InstagramClient(client_id, client_secret);

    return instagram_client;
}
