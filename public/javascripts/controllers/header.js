var MENU = [
  { nombre:"Lista de Usuarios", url:"/usuarios/" },
  { nombre:"Crear Usuarios", url:"/usuarios/formulario" },
  { nombre:"Lista de Notificaciones", url:"/notificaciones/" },
  { nombre:"Crear Notificaciones", url:"/notificaciones/formulario" },
  { nombre:"Lista de Centros de trabajo", url:"/centros-de-trabajo/" },
  { nombre:"Crear Centros de trabajo", url:"/centros-de-trabajo/formulario" },
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
      // if (InicioDeSesionFactoria.usuarioConectado()) {
      //   $cCtr.usuarioConectado = InicioDeSesionFactoria.obtenerUsuarioConectado();
      //   $cCtr.estructuraMenu = MenuFactoria.cargarOpcionesEstructuradas($cCtr.usuarioConectado.atributos.menu);
      // }
    };

    // $cCtr.cerrarSesion = function() {
    //  InicioDeSesionFactoria.cerrarSesion();
    // };

    // $cCtr.enLinea = $rootScope.enLinea;
    // var dialogoMostrado = false;
    // $rootScope.$watch('enLinea', function(nuevoEstado, viejoEstado) {
    //   if(nuevoEstado == viejoEstado)
    //     return;
    //   $cCtr.enLinea = nuevoEstado;
    //   if(nuevoEstado){
    //     DialogoFactoria.cerrar();
    //     dialogoMostrado = false;
    //   }else{
    //     if (!dialogoMostrado) {
    //       DialogoFactoria.rojo({
    //         titulo: "Internet fuera de línea",
    //         contenido: "<div layout='row' layout-sm='column' layout-xs='column' layout-align='center center'> <div flex='30' flex-sm='100' flex-xs='100'> <center> <i class='material-icons color-rojo md-60'>error</i> </center> </div> <div flex='70' flex-sm='100' flex-xs='100'> <h4>Verifica tu conexión para continuar</h4> </div> </div>",
    //         cerrarConEscape: false,
    //         cerrarConClickAfuera: false,
    //         botonSuperiorCerrar: false,
    //         controller: function($timeout) {
    //           var $rCtr = this;
    //         },
    //         controllerAs: '$rCtr',
    //         botones: []
    //       });
    //     }
    //     dialogoMostrado = true;
    //   }
    // });
    //
    // var cantidadDeNotificaciones = 0, cantidadDeTareas = 0, cantidadDeClientesSeguimiento = 0, cantidadDeMantenimientos = 0;
    // // $rootScope.cantidades = {notificaciones: 0, tareas: 0, mantenimientos: 0, seguimientoClientes: 0};
    //
    // $rootScope.$on('cantidadDeNotificaciones', function($event, data) {
    //   // $rootScope.cantidades.notificaciones = data || 0;
    //   cantidadDeNotificaciones = data || 0;
    // });
    // $rootScope.$on('cantidadDeTareas', function($event, data) {
    //   // $rootScope.cantidades.tareas = data || 0;
    //   cantidadDeTareas = data || 0;
    // });
    // $rootScope.$on('cantidadDeClientesSeguimiento', function($event, data) {
    //   // $rootScope.cantidades.seguimientoClientes = data || 0;
    //   cantidadDeClientesSeguimiento = data || 0;
    // });
    // $rootScope.$on('cantidadDeMantenimientos', function($event, data) {
    //   // $rootScope.cantidades.mantenimientos = data || 0;
    //   cantidadDeMantenimientos = data || 0;
    // });

    // $rootScope.$watch('cantidades', function(nuevasCantidades, viejasCantidades) {
    //   console.log("entra");
    //   // if(nuevasCantidades == viejasCantidades)
    //   //   return;
    //   // $cCtr.cantidadDeNotificacionesGenerales = Object.values(nuevasCantidades).reduce(function(valorAnterior, valorActual){
    //   //   return valorAnterior + valorActual;
    //   // });
    // });

    // calcularCantidadDeNotificaciones();
    // $rootScope.$on('actualizarNotificaciones', function($event) {
    //   calcularCantidadDeNotificaciones();
    // });
    //
    // function calcularCantidadDeNotificaciones(){
    //   $timeout(function(){
    //     try {
    //       var resultado = Number(cantidadDeNotificaciones) + Number(cantidadDeTareas) + Number(cantidadDeMantenimientos) + Number(cantidadDeClientesSeguimiento);
    //       if (resultado >= 0)
    //         $cCtr.cantidadDeNotificacionesGenerales = resultado;
    //     } catch (error) {
    //       console.log(error);
    //     }
    //   }, 3000);
    // }
    //
    //
    // $rootScope.direccionarScroll = function(elemento) {
    //   $location.hash(elemento);
    //   $anchorScroll();
    // };


  }]);
})();
