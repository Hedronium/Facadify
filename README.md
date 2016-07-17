# Facadify

Laravel like global Facades in [Node](https://nodejs.org/en/), [Browserify](http://browserify.org/) and [Webpack](https://webpack.github.io/)!

> ... and most other CommonJS loaders.

## Install

```BASH
npm install --save facadify
```


## Usage

Facadify relies on the module loader in order to be global. Specifically
the fact that module loaders return the same instance loaded once for all scripts
that refference it in the current application.

To leverage the module loader we must first make a file named anything you like
and put wherever you like.

eg: `path_to_app/facades/potato_facade.js`

```JS
module.exports = function PotatoFacade(){};
```

yep it's that simple. We just need a global object nothing else (it doesn't even have to be a function `module.exports = {};` would have ben equally valid but providing a function name looks nice when it is `console.log()`-ed).

Now when you bootstrap your application:

```JS
var facadify = require('facadify');
var potato = require('./modules/potato');

// facadify(Object obj, Object facade)
facadify(new Potato('Salad'), require('./facades/potato_facade.js'));
```

Now in any other modules in your application you may use the facade just by requiring it and calling methods on it. As an example lets assume the implementation of the Potato class to be:

```JS
var Potato = function (dish) {
	this.dish = dish;
}

Potato.prototype.dishName = function () {
	return 'Potato ' + this.dish;
}
```

after bootstrapping is complete, you can require it any other file and it would work nicely. Like:

```JS
var PotatoFacade = require('../facades/potato_facade.js');

console.log(PotatoFacade.dishName()); // Potato Salad
```

## Getting the root Instance

You can reach to the root instance of the facade with the `facade.getFacadeRoot()` method on facades.

```JS
var x = {
	action: 'jump',
    do_something: function() { return this.action; }
};

var facade = {};
facadify(x, facade);

console.log(facade.getFacadeRoot === x); // ture
```

## Swap the Instance

You can swap out the root instance of the facade with anything else if you like with the `facade.swapFacadeRoot(Object obj)` method on a facade object.

```JS
var x = {
	action: 'jump',
    do_something: function() { return this.action; }
};

var y = {
	action: 'run',
    do_something: function() { return this.action; }
};

var facade = {};
facadify(x, facade);
facade.swapFacadeRoot(y);

console.log(facade.do_something()); // run
```

## Testing
Just install all dev dependencies and run `npm test` and watch the magic unfold.
