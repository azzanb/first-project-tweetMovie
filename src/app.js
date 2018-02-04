const bodyParser = require('body-parser'),
  express = require('express'),
  app = express(),

  http = require('http'),
  morgan = require('morgan'),
  pug = require('pug'),
  path = require('path'),
  
  {mongoose} = require('./../db/mongoose'),
  routes = require('./routes/routes')
;



//------------SETUP APP------------//
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

const port process.env.PORT || 3000);


//------------MongoDB DATABASE------------//
const db = mongoose.connection;

db.on('open', () => {
  console.log("Connected to MongoDB!");
}, (err) => {
  console.log(err);
});

db.on('error', (err) => {
  console.log(err);
});



//------------Set HTTP Calls to Routes------------//
app.use('/introPage', routes);
app.use('/', routes);





//------------ERROR HANDLING------------//
app.use(function(req, res, next) {
  var err = new Error('File Not Found');
  err.status = 404;
  next(err);
});

// Express's global error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.send(err);
  console.log(err.Error);
});




//------------START SERVER------------//
app.listen(process.env.PORT || 3000, function(){
  console.log("Final Project is listening on port " + app.get('port'));
});
