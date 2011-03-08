
var instagram = require('./../index.js').createClient('a8d764b1a7fe4089959910ee6bdcedce',
						      '253a2b9abade4f25adb3825249d98b85');

exports.testLocationsFetchById = function (test) {
    test.expect(2);

    instagram.locations.id(1, function (location, error) {
	test.ok(location.id);
	test.equal(error, null);

	test.done();
    });
}

exports.testLocationsMedia = function (test) {
    test.expect(12);

    var max_id = 0, min_id = 0;

    var callback = function (media, error, pagination) {
	test.ok((media.length > 0));
	test.ok((pagination != null));
	test.equal(error, null);
    }

    instagram.tags.media(1, function (media, error, pagination) {
	callback(media, error, pagination);

	max_id = media[0].id;
	min_id = media[media.length-1].id;
    });
    instagram.tags.media(1, {max_id: max_id}, callback);
    instagram.tags.media(1, {min_id: min_id}, callback);
    instagram.tags.media(1, {max_id: max_id, min_id: min_id}, 
			 function (media, error, pagination) {
			     callback(media, error, pagination);
			     test.done();
			 });
}

exports.testLocationsSearch = function  (test) {
    var datas = [{lat: 48.858844, lng: 2.294351},
		 {lat: 48.858844, lng: 2.294351, distance: 3000},
		 {foursquare_id: 44379, distance: 1000}];

    test.expect(datas.length*2);

    var do_it = function (i, callback) {
	instagram.locations.search(datas[i], function (locations, error) {
	    test.ok((locations.length > 0));
	    test.equal(error, null, "Return error for "+datas[i]);
	    
	    if (i < datas.length-1) {
		do_it(i+1, do_it);
	    }else{
		test.done();
	    }
	});
    }

    do_it(0);
}