
var http = require('http'),
    https = require('https'),
    querystring = require('querystring');


function InstagramClient(client_id, client_secret) {
    this.client_id = client_id;
    this.client_secret = client_secret;

    this.media = new InstagramMediaClient(this);
    this.tags = new InstagramTagsClient(this);
    this.locations = new InstagramLocationsClient(this);
    this.users = new InstagramUsersClient(this);
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

	    var pagination = null;
	    if (typeof(response['pagination']) != 'undefined') {
		pagination = response['pagination'];
	    }

	    if (response['meta']['code'] == 200) {
		callback(response['data'], 
			 null, 
			 pagination);
	    }else{
		callback(response['meta'], response['meta']['code'], pagination);
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

function InstagramLocationsClient (parent) {
    this.parent = parent;
}

InstagramLocationsClient.prototype.id = function (id, callback) {
    this.parent.fetch('/v1/locations/'+id, callback);
}

InstagramLocationsClient.prototype.media = function (id, params, callback) {
    if (arguments.length < 3) {
	var callback = params;
	params = {};
    }

    this.parent.fetch('/v1/locations/'+id+'/media/recent',
		      params,
		      callback);
}

InstagramLocationsClient.prototype.search = function (params, callback) {
    this.parent.fetch('/v1/locations/search', params, callback);
}

function InstagramUsersClient (parent) {
    this.parent = parent;
}

InstagramUsersClient.prototype.id = function (id, callback) {
    this.parent.fetch('/v1/users/'+id, callback);
}

InstagramUsersClient.prototype.media = function (id, params, callback) {
    this.parent.fetch('/v1/users/'+id+'/media/recent', params, callback);
}

InstagramUsersClient.prototype.self = function (params, callback) {
    this.parent.fetch('/v1/users/self/feed', params, callback);
}

InstagramUsersClient.prototype.search = function (params, callback) {
  if (typeof params == "string") {
    params = {
      q: params
    }
  }
  this.parent.fetch('/v1/users/search/', params, callback);
}

exports.createClient = function (client_id, client_secret) {
    var instagram_client = new InstagramClient(client_id, client_secret);

    return instagram_client;
}
