# Dependency Injector [![Build Status](https://secure.travis-ci.org/dowjones/di.png)](http://travis-ci.org/dowjones/di) [![NPM version](https://badge.fury.io/js/areus-di.svg)](http://badge.fury.io/js/areus-di)

Here's an example of a module that has two parts: a service and a db.
The service depends on the db.

Here's the `db.js`:
```javascript
module.exports = Db;

function Db() {
}

Db.$inject = [];

Db.prototype.answer = function () {
  return 42;
};
```

And here's `service.js`:
```javascript
module.exports = Service;

function Service(db) {
  this._db = db;
}

Service.$inject = [
  './db'
];

Service.prototype.answer = function () {
  return this._db.answer();
};
```

Note how the service has one special property `$inject`.
It is an array of paths of modules that are to be "injected".
Use this just as you use `require()`. The [exact same rules
that Node.js uses for resolving the modules](http://nodejs.org/api/modules.html#modules_all_together)
apply.

The only difference is that if the `$inject`ed module
is a "class" (function) which has an `$inject` property
that is an array, a new instance of that class will be created
and provided as an argument of the constructor
of the class that `$inject`ed it. This happens recursively.
Thus, if the injected class had an `$inject` of its own, that
would be resolved first.

For example, in this case the `Db` has no dependencies to inject,
so a new instance of the `Db` class will be created
and provided as the first argument in `Service`'s constructor.


Finally, here's `index.js` that gets a fresh new instance
of the `Service` class.

```javascript
var DI = require('areus-di'),
  di = DI(__dirname);

exports.create = function () {
  return di.create('./service');
};
```

The `__dirname` is the root directory, relative to which
`./service` is locataed.


## Providing Existing Packages

Use the `.provide()` method to provide existing packages.
Any package that you give to `.provide()` will be available
in `$inject`. Here's an example:

`index.js`
```javascript
var DI = require('areus-di'),
  mongo = require('mongoskin'),
  di = DI(__dirname);

di.provide({
  db: mongo.db(process.env.MONGO_URI)
});

di.create('./article_service');
```

`article_service.js`
```javascript
module.exports = ArticleService;

function ArticleService(db) {
  this._articles = db.collection('articles');
}

ArticleService.$inject = [
  'db'
];

ArticleService.prototype.findOne = function (id, cb) {
  this._articles.findOne(id, cb);
};
```


## Why Use a Dependency Injector?

- **Isolation** In the example above `Service` did not need to know how `Db`
  was created. It did not have to be aware of the dependencies
  of `Db` or care whether it was backed by `LevelDB`, `MongoDB`
  or `PostgreSQL`. This is important because this implies that
  `Db` can change independently from `Service`.

- **Testability** to test `Service` a new instance can be created
  with a fake Db as the first argument. For example:


```javascript
var Service = require('../service'),
  assert = require('assert'),
  fakeDb, service;

fakeDb = {
  answer: function () {
    return 7;
  }
};

service = new Service(fakeDb);
assert.equal(7, service.answer());
```


## Guiding Principles

- No new knowledge needed for basic operation.
  - Path resolution follows the [require()](http://nodejs.org/api/modules.html#modules_all_together) algorithm to a T.

- In addition to `require()`, `$inject` instantiates the "class".


## License
[MIT](LICENSE)
