var Usuario = function(){};


Usuario.prototype.PERMISO = {
	CREAR:  'usuario.crear',
	EDITAR:  'usuario.editar',
	// VER:  'usuario.ver',
	LISTAR:  'usuario.listar',
	FOTOS:  'fotos',
	ELIMINAR:  'usuario.eliminar',
	PERMISOS: {
		CREAR:  'permisoOperacion.crear',
		EDITAR:  'permisoOperacion.editar',
		LISTAR:  'permisoOperacion.listar',
	}
},



module.exports = new Usuario();
