(function(){
  'use strict';

  app.controller('listaUsuario', function($http, $timeout, $mdDialog, ToastFactoria, $filter){
    var $lCtrl = this;
    $lCtrl.pagina = 0;
    $lCtrl.idEliminar = 0;
    $lCtrl.registrosXpagina = 10;
    $lCtrl.filtros = {};

    $lCtrl.listarUsuarios = function () {

      $http.get('/usuarios/listar')
      .then(function(result){
        console.log('result');
        console.log(result);
        $lCtrl.usuarios = result.data;
        // $lCtrl.usuarios = [];
        // for (var i = 0; i < 4600; i++) {
        //   let a = {
        //     nombre: i,
        //     usuarioRed: i,
        //     correo: i,
        //     fechaCreacion: i,
        //     estado: i,
        //     idAplicacionMovil: i,
        //
        //   }
        //   $lCtrl.usuarios.push(a);
        // }
        $lCtrl.usuariosFiltrados = $lCtrl.usuarios;
        $lCtrl.paginar();
      })
      .catch(function(e){
        console.log(e);
      });
    };



    $lCtrl.eliminar = function () {
      $http.get('/usuarios/eliminar/' + $lCtrl.idEliminar)
      .then(function(result){
        ToastFactoria.verde({contenido: 'Usuario eliminado exitosamente'});
        $lCtrl.cerrar();
        $lCtrl.listarUsuarios();
      })
      .catch(function(e){
        ToastFactoria.rojo({contenido: 'No se pudo eliminar el usuario, intentelo mas tarde.'});
        $lCtrl.cerrar();
      });
    };


    $lCtrl.confirmarEliminar = function(ev, id) {
      $lCtrl.idEliminar = id;
      $mdDialog.show({
        contentElement: '#myDialog',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose: true
      });
    };

    $lCtrl.cerrar = function() {
      $lCtrl.idEliminar = null;
      $mdDialog.hide();
    };


    $lCtrl.filtrar = function() {
      $lCtrl.usuariosFiltrados = $filter('filter')($lCtrl.usuarios, $lCtrl.search);
      $lCtrl.paginar();
    };


    $lCtrl.paginar = function() {
      $lCtrl.totalPaginas = Math.ceil($lCtrl.usuariosFiltrados.length/$lCtrl.registrosXpagina);
    };


    $lCtrl.ordenarPor = function (campo) {
      $lCtrl.reverse = ($lCtrl.propertyName === campo) ? !$lCtrl.reverse : false;
      $lCtrl.propertyName = campo;
    }


    $lCtrl.listarUsuarios();

  });
})();
