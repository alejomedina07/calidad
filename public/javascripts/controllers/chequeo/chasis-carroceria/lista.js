(function(){
  'use strict';

  app.controller('listaChasisCarroceria', function($http, $timeout, $mdDialog, ToastFactoria, $filter){
    var $lCtrl = this;

    $lCtrl.init = function() {
      $lCtrl.listarChasisCarroceria();
      $lCtrl.form = {estado:'Activo'};
    };


    // Lista
    $lCtrl.pagina = 0;
    $lCtrl.idEliminar = 0;
    $lCtrl.registrosXpagina = 10;
    $lCtrl.filtros = {};

    $lCtrl.listarChasisCarroceria = function () {
      $lCtrl.loading = true;
      $http.get('/chequeo/chasis-carroceria/listar')
      .then(function(result){
        $lCtrl.registros = result.data;
        $lCtrl.registrosFiltrados = $lCtrl.registros;
        $lCtrl.paginar();
        $lCtrl.loading = false;
      })
      .catch(function(e){
        $lCtrl.loading = false;
        console.log(e);
      });
    };

    $lCtrl.filtrar = function() {
      $lCtrl.registrosFiltrados = $filter('filter')($lCtrl.registros, $lCtrl.search);
      $lCtrl.paginar();
    };


    $lCtrl.paginar = function() {
      $lCtrl.totalPaginas = Math.ceil($lCtrl.registrosFiltrados.length/$lCtrl.registrosXpagina);
    };


    $lCtrl.ordenarPor = function (campo) {
      $lCtrl.reverse = ($lCtrl.propertyName === campo) ? !$lCtrl.reverse : false;
      $lCtrl.propertyName = campo;
    }

    $lCtrl.init();

  });
})();
