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
mongoose.connect(process.env.DATABASE); //mongoose.connect('mongodb://projekt_www:projekt@ds129156.mlab.com:29156/projekt_www');
mongoose.Promise = global.Promise;
mongoose.connection.on('error', (err) => {
  console.error(err.messege)
})


const nameSchema = new mongoose.Schema({
    name: String,
    fbPicture: String,
    poster: String,
    date: Number,
    filmName: String,
    myScore: String,
    myOpinion: String,
    comments: [String],
    name2: [String],
    fbPicture2: [String],
    like: [Number]
});

const likeSchema = new mongoose.Schema({
  id: String,
  name3: String,
  like: Number
})
  //Create a Model by using the schema defined above
  //Optionally one can provide the name of collection where the instances
  //of this model get stored. In this case it is "mongoose_demo". Skipping
  //this value defaults the name of the collection to plural of model name i.e users.
const user = mongoose.model("user", nameSchema);
const like = mongoose.model("like", likeSchema);

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

app.post("/addname2", (req, res, next) => {
  //res.send(req.body)
  user.update({date : {$eq: req.body.time}}, {$push: {comments: req.body.comments, name2: req.body.name2, fbPicture2: req.body.fbPicture2}}, function(err, result){
  console.log("Updated successfully");
  console.log(result);
  next()
})}, function(req, res, next){
  res.redirect('/');
});

app.post("/addname3", (req, res, next) => {
  if(!req.body.like){
    req.body.like = "-1"
  }
  //res.send(req.body)
  user.update({_id : {$eq: req.body.id}}, {$push: {like: Number(req.body.like)}}, function(err, result){
  console.log("Updated successfully");
  console.log(result);
  next()
})}, function(req, res, next){
    res.redirect('/');
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
