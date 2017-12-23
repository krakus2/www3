var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
require('dotenv').config({ path: 'variables.env' })
/*require("babel-core").transform("code", {
  presets: ["es2015"]
});*/

//var index = require('./routes/index');
var users = require('./routes/users');
var add = require('./routes/add')
var movie = require('./routes/movie')

var mongoose = require("mongoose");
mongoose.connect('mongodb://projekt_www:projekt@ds129156.mlab.com:29156/projekt_www');
mongoose.Promise = global.Promise;
mongoose.connection.on('error', (err) => {
  console.error(err.messege)
})


var nameSchema = new mongoose.Schema({
    name: String,
    fbPicture: String,
    poster: String,
    date: Number,
    filmName: String,
    myScore: String,
    myOpinion: String
});
var user = mongoose.model("user", nameSchema);

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); //zmienilem domyslne false na true
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



//app.use('/', index);
app.get('/', function(req, res){
	user.find({}, function(err, docs){
		if(err) res.json(err);
		else    res.render('layout', {users: docs}); //'index'
	});
});
app.use('/add', add);
app.use('/movie', movie);
app.post("/addname", (req, res, next) => {
  let myData = new user(req.body);
  myData.save()
    .then(item => {
      console.log(item)
      res.send("item saved to database");
    })
    .catch(err => {
      res.status(400).send("unable to save to database");
    });
    next()
    //setTimeout(next, 1500);
}, function(req, res, next){
  res.redirect('/')
});




// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
