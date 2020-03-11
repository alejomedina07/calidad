var MENU = [
  { nombre:"Lista de Usuarios", url:"/usuarios/" },
  { nombre:"Crear Usuarios", url:"/usuarios/formulario" },
  { nombre:"Lista de Notificaciones", url:"/notificaciones/" },
  { nombre:"Crear Notificaciones", url:"/notificaciones/formulario" },
  { nombre:"Lista de Centros de trabajo", url:"/centros/" },
  { nombre:"Crear Centros de trabajo", url:"/centros/formulario" },
];

(function(){
  'use strict';

  app.controller('header', ['$scope', '$rootScope', '$mdSidenav', '$mdDialog', function($scope, $rootScope, $mdSidenav, $mdDialog){
    var $cCtr = this;
    $cCtr.MENU = MENU;



    $cCtr.actualizar = function() {
     // $state.reload();
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
