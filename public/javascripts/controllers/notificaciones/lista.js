(function(){
  'use strict';

  app.controller('listaNotificacion', function($http, $timeout, $mdDialog, $filter, ToastFactoria){
    var $lCtrl = this;
    $lCtrl.pagina = 0;
    $lCtrl.idEliminar = 0;
    $lCtrl.registrosXpagina = 10;
    $lCtrl.fechaInicio = new Date()
    $lCtrl.fechaFin = new Date()
    $lCtrl.form = {};




    $lCtrl.excel = function (filtrados) {
      let array;
      if (filtrados) {
        array = $lCtrl.notificacionesFiltrados
      }else {
        array = $lCtrl.notificaciones.filter(x => x.fechaCierre);
      }
      fnExcelReport(array);
    }

    function fnExcelReport(array)
    {
      var k = '<tbody>'
      array.forEach((item, i) => {
        let fechaCierre = item.fechaCierre ? moment(item.fechaCierre).format('LLL') : '';
        k+= '<tr>';
        k+= '<td>' + item.usuario + '</td>';
        k+= '<td>' + moment(item.fechaCreacion).format('LLL') + '</td>';
        k+= '<td>' + fechaCierre + '</td>';
        k+= '<td>' + item.descripcion + '</td>';
        k+= '<td>' + item.causa + '</td>';
        k+= '<td>' + item.centro + '</td>';
        k+= '</tr>';
      });

      k+='</tbody>';
      document.getElementById('tbody').innerHTML = k;
        var tab_text="<table border='2px'><tr bgcolor='#87AFC6'>";
        var textRange; var j=0,
        tab = document.getElementById('headerTable'); // id of table

        for(j = 0 ; j < tab.rows.length ; j++)
        {
            tab_text=tab_text+tab.rows[j].innerHTML+"</tr>";
            //tab_text=tab_text+"</tr>";
        }

        tab_text=tab_text+"</table>";
        tab_text= tab_text.replace(/<A[^>]*>|<\/A>/g, "");//remove if u want links in your table
        tab_text= tab_text.replace(/<img[^>]*>/gi,""); // remove if u want images in your table
        tab_text= tab_text.replace(/<input[^>]*>|<\/input>/gi, ""); // reomves input params

        var ua = window.navigator.userAgent;
        var msie = ua.indexOf("MSIE "), sa;

        if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))      // If Internet Explorer
        {
            txtArea1.document.open("txt/html","replace");
            txtArea1.document.write(tab_text);
            txtArea1.document.close();
            txtArea1.focus();
            sa=txtArea1.document.execCommand("SaveAs",true,"Say Thanks to Sumit.xls");
        }
        else {                //other browser not tested on IE 11
            // sa = window.open('data:application/vnd.ms-excel;charset=UTF-8;base64,' + encodeURIComponent(tab_text));
            var a = document.getElementById('csv');
            a.textContent='download';
            a.download="Notificaciones.xls";
            a.href='data:application/vnd.ms-excel;charset=utf-8,%EF%BB%BF,' + encodeURIComponent(tab_text);
            a.click();
        }
    }

    $lCtrl.listarNotificaciones = function () {
      if (moment($lCtrl.fechaFin).diff($lCtrl.fechaInicio, "month", true) <= 3) {

        let url = `/notificaciones/listar?fechaInicio=${moment($lCtrl.fechaInicio).format('YYYY-MM-DD')}
          &fechaFin=${moment($lCtrl.fechaFin).format('YYYY-MM-DD')}`
        $http.get(url)
        .then(function(result){
          $lCtrl.notificaciones = result.data;
          $lCtrl.notificacionesFiltrados = $lCtrl.notificaciones;
          $lCtrl.paginar();
        })
        .catch(function(e){
          console.log(e);
        });
      }else ToastFactoria.rojo({contenido: 'El rango entre las fechas no deben ser mayor a 3 meses.'});
    };

    $lCtrl.cerrarNotificacion = function () {
      $lCtrl.errores = validate($lCtrl.form, _validar);
      if (!$lCtrl.errores) {
        $lCtrl.form.id = $lCtrl.detalleNotificacion.id;
        $http.post('/notificaciones/cerrar-notificacion/', $lCtrl.form)
        .then(function(result){
          ToastFactoria.verde({contenido: 'Notificación cerrada exitosamente'});
          $lCtrl.cerrar();
          $lCtrl.listarNotificaciones();
        })
        .catch(function(e){
          ToastFactoria.rojo({contenido: 'No se pudo cerrar la notificación, intentelo mas tarde.'});
          $lCtrl.cerrar();
        });
      }else ToastFactoria.rojo({contenido: 'Revise los campos.'});
    };



    $lCtrl.marcarAsistencia = function (id) {
      let url = `/notificaciones/marcar-asistencia/${$lCtrl.detalleNotificacion.id}/${id}`
      $http.get(url)
      .then(function(result){
        ToastFactoria.verde({contenido: 'Asistencia marcada exitosamente'});
        $lCtrl.detalleNotificacion.asistentes = result.data;
      })
      .catch(function(e){
        console.log('e');
        console.log(e);
        ToastFactoria.rojo({contenido: 'No se pudo eliminar el usuario, intentelo mas tarde.'});
        // $lCtrl.cerrar();
      });
    };


    $lCtrl.detalle = function(ev, item) {
      $lCtrl.detalleNotificacion = item;
      $http.get('/notificaciones/obtener-asistencias/' + item.id)
      .then(value => {
        $lCtrl.detalleNotificacion.asistentes = value.data;
        $mdDialog.show({
          contentElement: '#myDialog',
          parent: angular.element(document.body),
          targetEvent: ev, clickOutsideToClose: false
        });

      })
      .catch(error => {
        console.log('error');
        console.log(error);
      });
    };

    $lCtrl.cerrar = function() {
      $lCtrl.detalleNotificacion = null;
      $mdDialog.hide();
    };


    $lCtrl.filtrar = function() {
      $lCtrl.notificacionesFiltrados = $filter('filter')($lCtrl.notificaciones, $lCtrl.search);
      $lCtrl.paginar();
    };


    $lCtrl.paginar = function() {
      $lCtrl.totalPaginas = Math.ceil($lCtrl.notificacionesFiltrados.length/$lCtrl.registrosXpagina);
    };


    $lCtrl.ordenarPor = function (campo) {
      $lCtrl.reverse = ($lCtrl.propertyName === campo) ? !$lCtrl.reverse : false;
      $lCtrl.propertyName = campo;
    }


    var _validar = {
      causa: {
        presence: {message: "^El campo 'Causa' es requerido"},
      },
      // descripcion: {
      //   presence: {message: "^El campo 'Descripción' es requerido"},
      // }
    };

    $lCtrl.listarNotificaciones();
  });

})();
