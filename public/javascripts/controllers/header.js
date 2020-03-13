var MENU = [
  { permiso:"usuario.listar", nombre:"Lista de Usuarios", url:"/usuarios/" },
  { permiso:"usuario.crear", nombre:"Crear Usuarios", url:"/usuarios/formulario" },
  { permiso:"notificacion.listar", nombre:"Lista de Notificaciones", url:"/notificaciones/" },
  { permiso:"notificacion.crear", nombre:"Crear Notificaciones", url:"/notificaciones/formulario" },
  { permiso:"centro.listar", nombre:"Lista de Centros de trabajo", url:"/centros/" },
  { permiso:"centro.crear", nombre:"Crear Centros de trabajo", url:"/centros/formulario" },
];

(function(){
  'use strict';

  app.controller('header', ['$scope', '$rootScope', '$mdSidenav', '$mdDialog', function($scope, $rootScope, $mdSidenav, $mdDialog){
    var $cCtr = this;

    $cCtr.MENU = MENU;

    $cCtr.operaciones = localStorage.getItem("operaciones");

    $cCtr.obtenerPermiso = function(permiso) {
      console.log('permiso');
      console.log(permiso);
      console.log('$cCtr.operaciones');
      console.log($cCtr.operaciones);
      return $cCtr.operaciones.includes(permiso);
    };

    $cCtr.abrirMenuIzquierda = function() {
     $mdSidenav('left').toggle();
    };

    $cCtr.abrirMenuDerecha = function() {
     $mdSidenav('right').toggle();
    };


    $cCtr.$onInit = function() {

    };


  }]);
})();
