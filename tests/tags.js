
var instagram = require('./../index.js').createClient('a8d764b1a7fe4089959910ee6bdcedce',
						      '253a2b9abade4f25adb3825249d98b85');


exports.testTagsSearch = function (test) {
    test.expect(2);

    instagram.tags.search('snow', function (tags, error, pagination) {
	test.ok((tags.length > 0));
	test.equal(error, null, "Returned an error");

	test.done();
    });
}

exports.testTagsMedia = function (test) {
    test.expect(12);

    var max_id = 0, min_id = 0;

    var callback = function (media, error, pagination) {
	test.ok((media.length > 0));
	test.ok((pagination != null));
	test.equal(error, null);
    }

    instagram.tags.media('snow', function (media, error, pagination) {
	callback(media, error, pagination);

	max_id = media[0].id;
	min_id = media[media.length-1].id;
    });
    instagram.tags.media('snow', {max_id: max_id}, callback);
    instagram.tags.media('snow', {min_id: min_id}, callback);
    instagram.tags.media('snow', {max_id: max_id, min_id: min_id}, 
			 function (media, error, pagination) {
			     callback(media, error, pagination);
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