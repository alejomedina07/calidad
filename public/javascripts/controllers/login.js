(function(){
  'use strict';

  app.controller('login', ['$scope', '$rootScope', '$http', 'md5', function($scope, $rootScope, $http, md5){
    var $lCtrl = this;



    $lCtrl.login = function() {
      if ($lCtrl.form.contrasena) {
        $lCtrl.form.contrasena = md5.createHash($lCtrl.form.contrasena);
      };
      $http.post('/login', $lCtrl.form)
      .then(result => {
        localStorage.setItem("token", result.data.token);
        window.location.href = "/notificaciones/formulario";
      })
      .catch(error => {
        console.log('error');
        console.log(error);
      });
    };


  }]);
})();
