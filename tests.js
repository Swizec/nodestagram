
var instagram = require('./index.js').createClient('a8d764b1a7fe4089959910ee6bdcedce',
						   '253a2b9abade4f25adb3825249d98b85');


exports.testMediaFetchById = function (test) {
    test.expect(2);

    instagram.media.id(100, function (media, error) {
	test.ok(media['type']);
	test.equal(error, null, "Returned an error");

	test.done();
    });
};

exports.testMediaFetchPopular = function (test) {
    test.expect(2)

    instagram.media.popular(function (media, error) {
	test.ok((media.length > 0));
	test.equal(error, null, "Returned an error");

	test.done();
    });
};

exports.testMediaSearch = function (test) {
    var params = [{lat: 37.7937111, lng: -122.3926227},
		  {lat: 37.7937111, lng: -122.3926227, distance: 2000}];

    test.expect(params.length*2);
    
    var do_it = function (i, callback) {
	instagram.media.search(params[i], function (media, error) {
	    test.ok((media.length > 0));
	    test.equal(error, null, "Return error for "+params);
	    
	    if (i < params.length-1) {
		do_it(i+1, do_it);
	    }else{
		test.done();
	    }
	});
    }

    do_it(0);
};

exports.testTagsSearch = function (test) {
    test.expect(2);

    instagram.tags.search('snow', function (tags, error) {
	test.ok((tags.length > 0));
	test.equal(error, null, "Returned an error");

	test.done();
    });
}

exports.testTagsMedia = function (test) {
    test.expect(8);

    var max_id = 0, min_id = 0;

    var callback = function (media, error) {
	test.ok((media.length > 0));
	test.equal(error, null);
    }

    instagram.tags.media('snow', function (media, error) {
	callback(media, error);

	max_id = media[0].id;
	min_id = media[media.length-1].id;
    });
    instagram.tags.media('snow', {max_id: max_id}, callback);
    instagram.tags.media('snow', {min_id: min_id}, callback);
    instagram.tags.media('snow', {max_id: max_id, min_id: min_id}, 
			 function (media, error) {
			     callback(media, error);
			     test.done();
			 });
}

exports.testTagsTag = function (test) {
    test.expect(2);

    instagram.tags.tag('snow', function (tag, error) {
	test.ok(tag.media_count);
	test.equal(error, null);

	test.done();
    });
}