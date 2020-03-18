(function(){
  'use strict';
  app.factory('ToastFactoria', ['$mdToast', function ($mdToast) {
      function mostrarToast(parametros) { //recibe la clase 'toast-verde', 'toast-azul' o 'toast-rojo' para diferenciar en color
        $mdToast.show({
          template: '<md-toast class="'+parametros.color+'">' + parametros.contenido + '</md-toast>',
          position: parametros.posicion || 'bottom right',
          hideDelay: !angular.isUndefined(parametros.duracion) ? parametros.duracion : 3000,
        });
      }

      function rojo(parametros){
        parametros.color = 'toast-rojo';
        mostrarToast(parametros);
      }
      function verde(parametros){
        parametros.color = 'toast-verde';
        mostrarToast(parametros);
      }
      function azul(parametros){
        parametros.color = 'toast-azul';
        mostrarToast(parametros);
      }
      function cerrar(){
        $mdToast.hide();
      }

    return {
      rojo: rojo,
      azul: azul,
      verde: verde,
      cerrar: cerrar,
    };

  }]);

})();
