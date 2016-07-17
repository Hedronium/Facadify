var assert = require('chai').assert;
var facadize = require('../index.js');

describe('facadize', function() {
    it('should return the facade', function() {
        var x = {
            something: 'something',
            do_something: function(){
                return 'doing ' + this.something;
            }
        };

        var y = {};

        assert.isTrue(
            facadize(x, y) === y,
            'Does not return the facade'
        );
    });

    it('should copy methods', function() {
        var x = {
            say_something: function(){ return 'something'; },
            say_something_else: function(){ return 'something_else'; }
        };
        var y = {};

        facadize(x, y);

        assert.isTrue(
            ('say_something' in y) && ('say_something_else' in y),
            'Methods are not being copied.'
        );
    });

    it('should NOT copy properties', function() {
        var x = {
            say_something: function(){ return 'something'; },
            something: 'something',
            something_else: 'something_else'
        };

        var y = {};

        facadize(x, y);

        assert.isFalse(
            ('something' in y) || ('something_else' in y),
            'Properties are being copied.'
        );
    });

    it('should forward method calls to root object', function() {
        var triggered = false;
        var x = {do_something: function(){ triggered = true; }};
        var y = {};

        facadize(x, y);

        y.do_something();

        assert.isTrue(triggered, 'Method calls are not being forwarded.');
    });

    it('should forward parameters to root object method', function() {
        var triggered = null;
        var x = {do_something: function(is_triggered){ triggered = is_triggered; }};
        var y = {};

        facadize(x, y);

        y.do_something('potato');
        assert.isTrue(triggered === 'potato', 'Not holding refference to root object.');
    });

    it('should hold a refference to root object', function() {
        var triggered = false;
        var x = {do_something: function(){ triggered = true; }};
        var y = {};

        facadize(x, y);

        assert.isTrue(y.getFacadeRoot() === x, 'Not holding refference to root object.');
    });

    it('should ignore binding of methods', function() {
        var x = {
            something: 'something',
            do_something: function(){
                return 'doing ' + this.something;
            }
        };

        var y = {};

        var z = {something: 'something else'};

        facadize(x, y);

        assert.isFalse(
            (y.do_something.bind(z))() === 'doing something else',
            'Methods are bindable.'
        );
    });

    it('should ignore binding of methods', function() {
        var x = {
            something: 'something',
            do_something: function(){
                return 'doing ' + this.something;
            }
        };

        var y = {};

        var z = {something: 'something else'};

        facadize(x, y);

        assert.isFalse(
            (y.do_something.bind(z))() === 'doing something else',
            'Methods are bindable.'
        );
    });

    describe('swapFacadeRoot(Object obj)', function() {
        it('should change the facade root', function () {
            var x = { do_something: function(){} };
            var y = { do_something_else: function(){} };

            var z = {};
            facadize(x, z);

            z.swapFacadeRoot(y);

            assert.isFalse(
                z.getFacadeRoot() === x,
                'Facade root not being swapped.'
            );

            assert.isTrue(
                z.getFacadeRoot() === y,
                'Facade root not being swapped.'
            );
        });

        it('should remove old methods', function () {
            var x = { do_something: function(){} };
            var y = { do_something_else: function(){} };

            var z = {};
            facadize(x, z);

            z.swapFacadeRoot(y);

            assert.isFalse(
                'do_something' in z,
                'Old methods not being removed'
            );
        });

        it('should add new methods', function () {
            var x = { do_something: function(){} };
            var y = { do_something_else: function(){} };

            var z = {};
            facadize(x, z);

            z.swapFacadeRoot(y);

            assert.isTrue(
                'do_something_else' in z,
                'New methods are not being added'
            );
        });

        it('should call methods bound to new object', function () {
            var x = { a: 'apple', do_something: function(){ return this.a; } };
            var y = { a: 'asteroid', do_something: function(){ return this.a; } };

            var z = {};
            facadize(x, z);

            z.swapFacadeRoot(y);

            assert.isTrue(
                z.do_something() === 'asteroid',
                'Methods not being bound to new object.'
            );
        });
    });
});
