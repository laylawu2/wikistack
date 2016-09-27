var express = require('express');
var app = express();
var morgan = require('morgan');
var nunjucks = require('nunjucks');
var bodyParser = require('body-parser');
var socketio = require('socket.io');
var wikiRouter = require('./routes/wiki');
var path = require('path');

// ...

app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

app.use('/wiki', wikiRouter);

// point nunjucks to the directory containing templates and turn off caching; configure returns an Environment
// instance, which we'll want to use to add Markdown support later.
var env = nunjucks.configure('views', {noCache: true});
// have res.render work with html files
app.set('view engine', 'html');
// when res.render works with html files, have it use nunjucks to do so
app.engine('html', nunjucks.render);

app.use(morgan('dev'));



var server = app.listen(1337, function(){
  console.log('listening on port 1337')
});

var io = socketio.listen(server);

var models = require('./models');

models.User.sync({})
.then(function () {
    return models.Page.sync({})
})
.then(function () {
    server.listen(3001, function () {
        console.log('Server is listening on port 3001!');
    });
})
.catch(console.error);

app.use(express.static(path.join(__dirname, '/public')));

app.get('/', function(req, res, next){
  res.send('Hello!!!!!')
})
