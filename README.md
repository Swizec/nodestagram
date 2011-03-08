
# Nodestagram

This project started because I wanted to use instagram's API in node.js and there were no libraries yet.

Since everything is so fresh spanking new, forks/pull-requests much appreciated.

# Usage

The library is intended to be used as a thin wrapper over the basic Instagram API, so the
idea is to keep everything as similar to the original as possible.

Every method should be passed some parameters if needed and a callback function. The callback
should accept a result and an error argument.

The convention being that when the error is null, the result contains media as returnd from the API,
and when something goes wrong error is the status code as returned by the API and the result is the
meta info the API returned.

For example:

    var instagram = require('instagram').createClient('<client_id>', '<client_secret>');

    // fetch media by id
    instagram.media.id('<id>', function (images, error) { ... });

    // fetch popular media
    instagram.media.popular(function (images, error) { ... });

    // search media
    instagram.media.popular({lat: <some latitude>,
    		             lng: <some longitude>},
			    function (images, error) { ... });


    // get info about a tag
    instagram.tags.tag('snow', function (tag, error) { ... });

    // get recent media for a tag
    instagram.tags.media('snow', function (tag, error) { ... });
    instagram.tags.media('snow', {max_id: 5}, function (tag, error) { ... });
    instagram.tags.media('snow', {min_id: 5}, function (tag, error) { ... });
    instagram.tags.media('snow', {max_id: 5, min_id: 0}, function (tag, error) { ... });

    // search for a tag
    instagram.tags.search('snow', function (tags, error) { ... });


    // get info about a location
    instagram.tags.tag(1, function (tag, error) { ... });

    // get recent media for a location
    instagram.tags.media(1, function (tag, error) { ... });
    instagram.tags.media(1, {max_id: 5}, function (tag, error) { ... });
    instagram.tags.media(1, {min_id: 5}, function (tag, error) { ... });
    instagram.tags.media(1, {max_id: 5, min_id: 0}, function (tag, error) { ... });

    // search for a location
    instagram.tags.search({lat: ..., lng: ..., distance: ...}, function (tags, error) { ... });

# License

Some sort of BSD or MIT license,  the general idea being:

- this is open source
- you must give credit where credit is due
- not viral such as GPL
- you still can't change the license though