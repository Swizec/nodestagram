
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
    test.expect(2);

    instagram.locations.media(1, function (images, error) {
	test.ok((images.length > 0));
	test.equal(error, null);

	test.done();
    });
}

exports.testLocationsSearch = function  (test) {
    var datas = [];

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