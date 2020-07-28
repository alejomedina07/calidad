(function(){
  'use strict';

  app.controller('fotos', function($http, $timeout, $mdDialog, ToastFactoria, $filter){
    var $fCtrl = this;

    $fCtrl.init = function() {
      $fCtrl.listarRegistros();
      $fCtrl.form = {};
      debugger;
      if ($fCtrl.mensaje) {
        ToastFactoria.verde({contenido: $fCtrl.mensaje});
      }
    };


    // formulario

    $fCtrl.obtener_ops = function() {
      $http.get('/fotos/obtener-ops/'+  $fCtrl.obtenerLinea($fCtrl.form.linea) )
      .then(function(result){
        $fCtrl.ops = result.data;
        console.log($fCtrl.ops);
      })
      .catch(function(e){
        console.log(e);
      });
    };

    $fCtrl.obtenerLinea = function (linea) {
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

    $fCtrl.cambioOp = function() {
      var op = $fCtrl.ops.find(element => element.id == $fCtrl.form.idOp);
      $fCtrl.form.op = op.prefijo + op.op;
      document.getElementById('op').value = $fCtrl.form.op;
    };


    // Lista
    $fCtrl.pagina = 0;
    $fCtrl.idEliminar = 0;
    $fCtrl.registrosXpagina = 10;
    $fCtrl.filtros = {};

    $fCtrl.listarRegistros = function () {
      $fCtrl.loading = true;
      $http.get('/fotos/listar')
      .then(function(result){
        $fCtrl.registros = result.data;
        $fCtrl.registrosFiltrados = $fCtrl.registros;
        $fCtrl.paginar();
        $fCtrl.loading = false;
      })
      .catch(function(e){
        $fCtrl.loading = false;
        console.log(e);
      });
    };

    $fCtrl.filtrar = function() {
      $fCtrl.registrosFiltrados = $filter('filter')($fCtrl.registros, $fCtrl.search);
      $fCtrl.paginar();
    };


    $fCtrl.paginar = function() {
      $fCtrl.totalPaginas = Math.ceil($fCtrl.registrosFiltrados.length/$fCtrl.registrosXpagina);
    };


    $fCtrl.ordenarPor = function (campo) {
      $fCtrl.reverse = ($fCtrl.propertyName === campo) ? !$fCtrl.reverse : false;
      $fCtrl.propertyName = campo;
    }

    // $fCtrl.init();

  });
})();
