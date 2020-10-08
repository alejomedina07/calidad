var createError = require('http-errors');
  express = require('express'),
  path = require('path'),
  cookieParser = require('cookie-parser'),
  logger = require('morgan'),
  session = require('express-session'),
  bodyParser = require('body-parser'),
  favicon = require('express-favicon');
  app = express();


app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(favicon(__dirname + '/public/images/favicon.ico'));

app.use('/static',express.static(path.join(__dirname, '/node_modules')));
app.use('/static',express.static(path.join(__dirname, '/public')));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', require('./routes/index'));
app.use('/centros', require('./routes/centros'));
app.use('/usuarios', require('./routes/usuarios'));
app.use('/permisos', require('./routes/operacion'));
app.use('/permisos/rol', require('./routes/operacion_rol'));
app.use('/notificaciones', require('./routes/notificaciones'));

app.use('/fotos', require('./routes/fotos'));

app.use('/chequeo/defectos', require('./routes/chequeo/defectos'));
app.use('/chequeo/categorias', require('./routes/chequeo/categorias'));
app.use('/chequeo/operaciones', require('./routes/chequeo/operaciones'));
app.use('/chequeo/centro', require('./routes/chequeo/centro'));
app.use('/chequeo/control', require('./routes/chequeo/control'));
app.use('/chequeo/chasis-carroceria', require('./routes/chequeo/chasis-carroceria'));



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

//
// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};
//
//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

module.exports = app;
