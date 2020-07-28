var Centro = function(){};


Centro.prototype.PERMISO = {
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
		CREAR:  'control.crear',
		EDITAR:  'control.editar',
		LISTAR:  'control.listar',
	},

},



module.exports = new Centro();
