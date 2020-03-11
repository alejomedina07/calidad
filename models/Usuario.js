var Usuario = function(){};


Usuario.prototype.PERMISO = {
	CREAR:  'usuario.crear',
	EDITAR:  'usuario.editar',
	// VER:  'usuario.ver',
	LISTAR:  'usuario.listar',
	ELIMINAR:  'usuario.eliminar',
},



module.exports = new Usuario();
