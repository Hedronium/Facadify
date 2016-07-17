var facadize = require('../index.js');
var assert = require('chai').assert;
var testFacade = require('./extra/testFacade');

describe('global through CommonJs', function () {
    it('CommonJs should return the same Facadized Instance', function() {
        var x = {potato: 'potato'};

        facadize(x, require('./extra/testFacade'));

        assert.isTrue(
            (require('./extra/testGlobality'))() === require('./extra/testFacade'),
            'Not Global.'
        );

        assert.isTrue(
            (require('./extra/testGlobality'))() === testFacade,
            'Not Global.'
        );
    });
});
