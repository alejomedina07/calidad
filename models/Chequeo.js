var Chequeo = function(){};


Chequeo.prototype.PERMISO = {
	DEFECTO:{
		CREAR:  'defecto.crear',
		EDITAR:  'defecto.editar',
		LISTAR:  'defecto.listar',
	},
	OPERACION:{
		CREAR:  'operacion.crear',
		EDITAR:  'operacion.editar',
		LISTAR:  'operacion.listar',
	},
	CATEGORIA:{
		CREAR:  'categoria.crear',
		EDITAR:  'categoria.editar',
		LISTAR:  'categoria.listar',
	},
	CENTRO:{
		CREAR:  'centro.crear',
		EDITAR:  'centro.editar',
		LISTAR:  'centro.listar',
	},
	CONTROL:{
		CREAR:  'chequeo.crear',
		EDITAR:  'chequeo.editar',
		LISTAR:  'chequeo.listar',
		INACTIVAR:  'chequeo.inactivar',
	},

},



module.exports = new Chequeo();
