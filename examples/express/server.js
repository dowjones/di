var simple = require('../../'),
  ioc = simple(__dirname),
  resource = require('./util').createResource(ioc),
  express = require('express'),
  cons = require('consolidate'),
  PORT = process.env.PORT || 3000,
  app = express();

app.engine('mu', cons.hogan);
app.set('views', __dirname + '/views');
app.set('view engine', 'mu');

/**
 * Do the top-level routing here.
 * You can decide on the method, the params etc.
 * within a specific resource.
 */

app.use('/api/users', resource('users'));
app.use('/', resource('pages'));

app.listen(PORT, function () {
  console.log('Listening on http://localhost:' + PORT);
});
