var express = require('express'),
  path = require('path'),
  bodyParser = require('body-parser'),
  // mongoose = require ('mongoose'),
  
  app = express();


// mongoose.connect ('mongodb://localhost/es_vida');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "pug");

app.use('/static',express.static(path.join(__dirname, '/node_modules')));
app.use('/static',express.static(path.join(__dirname, '/public')));

app.use('/', require('./controllers/index'));


app.listen(3000);
