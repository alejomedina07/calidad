var express = require('express'),
  config = require( '../config/general' );
var debug = require('debug')('BC:controlador');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Login' });
});

router.get('/error', function(req, res, next) {
  res.render('error', { title: 'Login' });
});

module.exports = router;
