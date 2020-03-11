(function(){
  'use strict';

  app.controller('listaCentro', function($http, $timeout, $mdDialog, ToastFactoria, $filter){
    var $lCtrl = this;
    $lCtrl.pagina = 0;
    $lCtrl.idEliminar = 0;
    $lCtrl.registrosXpagina = 10;
    $lCtrl.filtros = {};

    $lCtrl.listarCentros = function () {

      $http.get('/centros/listar')
      .then(function(result){
        console.log('result');
        console.log(result);
        $lCtrl.centros = result.data;
        $lCtrl.centrosFiltrados = $lCtrl.centros;
        $lCtrl.paginar();
      })
      .catch(function(e){
        console.log(e);
      });
    };



    $lCtrl.eliminar = function () {
      $http.get('/centros/eliminar/' + $lCtrl.idEliminar)
      .then(function(result){
        ToastFactoria.verde({contenido: 'Usuario eliminado exitosamente'});
        $lCtrl.cerrar();
        $lCtrl.listarCentros();
      })
      .catch(function(e){
        ToastFactoria.rojo({contenido: 'No se pudo eliminar el centro, intentelo mas tarde.'});
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
      $lCtrl.centrosFiltrados = $filter('filter')($lCtrl.centros, $lCtrl.search);
      $lCtrl.paginar();
    };


    $lCtrl.paginar = function() {
      $lCtrl.totalPaginas = Math.ceil($lCtrl.centrosFiltrados.length/$lCtrl.registrosXpagina);
    };


    $lCtrl.ordenarPor = function (campo) {
      $lCtrl.reverse = ($lCtrl.propertyName === campo) ? !$lCtrl.reverse : false;
      $lCtrl.propertyName = campo;
    }


    $lCtrl.obtenerLinea = function (linea) {
      switch (linea) {
        case "LL":
          return "Linea Liviana";
          break;
        case "LP":
          return "Linea Pesada";
            break;
        case "LB":
          return "Linea BusStar";
            break;


      }
    }

    $lCtrl.listarCentros();

  });
})();
