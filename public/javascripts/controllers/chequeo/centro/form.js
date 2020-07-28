(function(){
  'use strict';

  app.controller('formCentro', function($scope, $http, $timeout, $mdDialog, ToastFactoria, $filter){
    var $fCtrl = this;
    $fCtrl.pagina = 0;
    $fCtrl.idEliminar = 0;
    $fCtrl.registrosXpagina = 10;
    $fCtrl.filtros = {};

    $fCtrl.init = function() {
      $fCtrl.form = {};
      $fCtrl.obtenerDefectos();
      $fCtrl.listarCarroceria();
    };

    $fCtrl.focoParaBuscar = function() {
      $timeout(function(){
        var campo = angular.element('.campo-busqueda');
        campo.focus();
      }, 500);
    };

    $fCtrl.buscar = function(ev) {
        ev.stopPropagation();
    };



    $fCtrl.listarCarroceria = function() {
      $http.get('/chequeo/centro/carrocerias')
      .then(result => {
        $fCtrl.carrocerias = result.data;
        if ($fCtrl.id.id) {
          return $http.get('/chequeo/centro/obtener/' + $fCtrl.id.id +'/' + $fCtrl.id.idCentro);
        }
      })
      .then(result => {
        console.log(result);
        if ($fCtrl.id.id) {
          $fCtrl.form = result.data[1][0];
          $fCtrl.form.id = $fCtrl.id.id;
          $fCtrl.form.defectos = result.data[0].map(x => x.idDefecto);
          // $fCtrl.form.operaciones = $fCtrl.form.operaciones.split(",");
          $fCtrl.form.operaciones = result.data[2];
          $fCtrl.buscarChasis();
          $fCtrl.obtenerOPs();
          // $fCtrl.form.operaciones.map( x => parseInt(x) );
        }
      })
      .catch(error => {
        console.log(error);
        ToastFactoria.rojo({contenido: 'No se pudo realizar la acción intentelo de nuevo.'});
        $fCtrl.loading = false;
      });
    };

    $fCtrl.buscarChasis = function() {
      $http.get('/chequeo/centro/chasis/' + $fCtrl.form.carroceria)
      .then(result => {
        $fCtrl.chasis = result.data;
        if ($fCtrl.id.id) {
          $fCtrl.buscarOperaciones();
        }
      })
      .catch(error => {
        console.log(error);
        ToastFactoria.rojo({contenido: 'No se pudo realizar la acción intentelo de nuevo.'});
        $fCtrl.loading = false;
      });
    };


    $fCtrl.buscarOperaciones = function () {
      $fCtrl.loading = true;
      $http.get('/chequeo/centro/operaciones/' + $fCtrl.form.idChasisCarroceria)
      .then(function(result){
        $fCtrl.operaciones = result.data;
        if ($fCtrl.id.id) {
          let operacionesSeleccionadas = [];
          $fCtrl.form.operaciones.forEach((item) => {
            let index = $fCtrl.operaciones.findIndex(i => i.idOperacion == item.idOperacion );
            if (index >= 0) {
              operacionesSeleccionadas.push($fCtrl.operaciones[index]);
            }
          });
          $fCtrl.form.operaciones = operacionesSeleccionadas;
        }
        $fCtrl.loading = false;
      })
      .catch(function(e){
        ToastFactoria.rojo({contenido: 'Ocurrio un error, intentelo mas tarde.'});
        $fCtrl.loading = false;
        console.log(e);
      });
    };


    $fCtrl.ordenar = [1,2,3,4,5,6,7];

    $fCtrl.openModal = function(ev) {
      $mdDialog.show({
        contentElement: '#myDialog',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose: true
      });
    };

    $fCtrl.close = function() {
      $mdDialog.hide();
    };


    $fCtrl.obtenerDefectos = function () {
      $fCtrl.loading = true;
      $http.get('/chequeo/centro/obtener-defectos')
      .then(function(result){
        $fCtrl.defectos = result.data;
        $fCtrl.loading = false;
      })
      .catch(function(e){
        $fCtrl.loading = false;
        console.log(e);
      });
    };


    $fCtrl.obtenerOPs = function () {
      $http.get('/centros/obtener-ops?codigo=' + $fCtrl.form.linea)
      .then(function(result){
        $fCtrl.listaOps = result.data;
      })
      .catch(function(e){
        console.log(e);
      });
    }

    $fCtrl.cerrar = function() {
      $fCtrl.idEliminar = null;
      $mdDialog.hide();
    };


    $fCtrl.filtrar = function() {
      $fCtrl.centrosFiltrados = $filter('filter')($fCtrl.centros, $fCtrl.search);
      $fCtrl.paginar();
    };


    $fCtrl.paginar = function() {
      $fCtrl.totalPaginas = Math.ceil($fCtrl.centrosFiltrados.length/$fCtrl.registrosXpagina);
    };


    $fCtrl.ordenarPor = function (campo) {
      $fCtrl.reverse = ($fCtrl.propertyName === campo) ? !$fCtrl.reverse : false;
      $fCtrl.propertyName = campo;
    }


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

    // $fCtrl.init();

    $fCtrl.guardar = function() {
      $fCtrl.loading = true;
      $fCtrl.errores = validate($fCtrl.form, _validar);
      if (!$fCtrl.errores) {
        var form = {}, operaciones = [];
        angular.copy( $fCtrl.form, form );
        form.operaciones.forEach((item, i) => {
          operaciones.push(item.idOperacion);
        });
        form.operaciones = operaciones;
        var url = $fCtrl.form.id ? '/chequeo/centro/editar' : '/chequeo/centro/';
        operaciones
        $http.post(url, form)
        .then(result => {
          ToastFactoria.verde({contenido: 'Centro creado exitosamente'});
          window.location.href = "/chequeo/centro/";
        })
        .catch(error => {

          console.log(error);
          ToastFactoria.rojo({contenido: 'No se pudo realizar la acción intentelo de nuevo.'});
          $fCtrl.loading = false;
        });
      }else {
        ToastFactoria.rojo({contenido: 'Revise los campos.'});
        $fCtrl.loading = false;
      }

    };

    var _validar = {
      linea: {
        presence: {message: "^El campo 'Línea de Producción' es requerido"},
      },
      idCentro: {
        presence: {message: "^El campo 'Centro de Trabajo' es requerido"},
      },
      defectos: {
        presence: {message: "^El campo 'Defectos' es requerido", allowEmpty: false},
      },
      operaciones: {
        presence: {message: "^El campo 'Operaciones' es requerido", allowEmpty: false},
      },
      carroceria: {
        presence: {message: "^El campo 'Carrocería' es requerido", allowEmpty: false},
      },
      idChasisCarroceria: {
        presence: {message: "^El campo 'Chasis' es requerido", allowEmpty: false},
      }

    };






    //
    //
    // am4core.ready(function() {
    //
    // // Themes begin
    // // am4core.useTheme(am4themes_dataviz);
    // am4core.useTheme(am4themes_spiritedaway);
    // am4core.useTheme(am4themes_animated);
    // // Themes end
    //
    // // Create chart instance
    // var chart = am4core.create("chartdivv", am4charts.XYChart);
    //
    // // Add data
    // chart.data = [{
    //     "country": "Lateral Der",
    //     "visits": 25
    //   }, {
    //     "country": "Lateral Izq",
    //     "visits": 23
    //   }, {
    //     "country": "Techos",
    //     "visits": 19
    //   }, {
    //     "country": "Base",
    //     "visits": 15
    //   }];
    //
    //   // Create axes
    //
    //   var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    //   categoryAxis.dataFields.category = "country";
    //   categoryAxis.renderer.grid.template.location = 0;
    //   categoryAxis.renderer.minGridDistance = 30;
    //
    //   categoryAxis.renderer.labels.template.adapter.add("dy", function(dy, target) {
    //     if (target.dataItem && target.dataItem.index & 2 == 2) {
    //       return dy + 25;
    //     }
    //     return dy;
    //   });
    //
    //   var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    //
    //   // Create series
    //   var series = chart.series.push(new am4charts.ColumnSeries());
    //   series.dataFields.valueY = "visits";
    //   series.dataFields.categoryX = "country";
    //   series.name = "Visits";
    //   series.columns.template.tooltipText = "{categoryX}: [bold]{valueY}[/]";
    //   series.columns.template.fillOpacity = .8;
    //
    //   var columnTemplate = series.columns.template;
    //   columnTemplate.strokeWidth = 2;
    //   columnTemplate.strokeOpacity = 1;
    //
    //   }); // end am4core.ready()
    //
    //
    //
    // am4core.ready(function() {
    //
    // // Themes begin
    // am4core.useTheme(am4themes_dataviz);
    // am4core.useTheme(am4themes_animated);
    // // Themes end
    //
    // // Create chart instance
    // var chart = am4core.create("chartdiv", am4charts.XYChart);
    // chart.scrollbarX = new am4core.Scrollbar();
    //
    // // // Add data
    // // chart.data = [{
    // //   "country": "USA",
    // //   "visits": 3025
    // // }, {
    // //   "country": "China",
    // //   "visits": 1882
    // // }, {
    // //   "country": "Japan",
    // //   "visits": 1809
    // // }, {
    // //   "country": "Germany",
    // //   "visits": 1322
    // // }, {
    // //   "country": "UK",
    // //   "visits": 1122
    // // }, {
    // //   "country": "France",
    // //   "visits": 1114
    // // }, {
    // //   "country": "India",
    // //   "visits": 984
    // // }, {
    // //   "country": "Spain",
    // //   "visits": 711
    // // }, {
    // //   "country": "Netherlands",
    // //   "visits": 665
    // // }, {
    // //   "country": "Russia",
    // //   "visits": 580
    // // }, {
    // //   "country": "South Korea",
    // //   "visits": 443
    // // }, {
    // //   "country": "Canada",
    // //   "visits": 441
    // // }];
    //
    // chart.data = [{
    //     "country": "Soldadura sin pulir",
    //     "visits": 25
    //   }, {
    //     "country": "Soldadura sin aplicar",
    //     "visits": 23
    //   }, {
    //     "country": "Faltan amarras",
    //     "visits": 19
    //   }, {
    //     "country": "Falta abrazadera",
    //     "visits": 15
    //   }, {
    //     "country": "Mal corte",
    //     "visits": 10
    //   }];
    // // Create axes
    // var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    // categoryAxis.dataFields.category = "country";
    // categoryAxis.renderer.grid.template.location = 0;
    // categoryAxis.renderer.minGridDistance = 30;
    // categoryAxis.renderer.labels.template.horizontalCenter = "right";
    // categoryAxis.renderer.labels.template.verticalCenter = "middle";
    // categoryAxis.renderer.labels.template.rotation = 270;
    // categoryAxis.tooltip.disabled = true;
    // categoryAxis.renderer.minHeight = 110;
    //
    // var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    // valueAxis.renderer.minWidth = 50;
    //
    // // Create series
    // var series = chart.series.push(new am4charts.ColumnSeries());
    // series.sequencedInterpolation = true;
    // series.dataFields.valueY = "visits";
    // series.dataFields.categoryX = "country";
    // series.tooltipText = "[{categoryX}: bold]{valueY}[/]";
    // series.columns.template.strokeWidth = 0;
    //
    // series.tooltip.pointerOrientation = "vertical";
    //
    // series.columns.template.column.cornerRadiusTopLeft = 10;
    // series.columns.template.column.cornerRadiusTopRight = 10;
    // series.columns.template.column.fillOpacity = 0.8;
    //
    // // on hover, make corner radiuses bigger
    // var hoverState = series.columns.template.column.states.create("hover");
    // hoverState.properties.cornerRadiusTopLeft = 0;
    // hoverState.properties.cornerRadiusTopRight = 0;
    // hoverState.properties.fillOpacity = 1;
    //
    // series.columns.template.adapter.add("fill", function(fill, target) {
    //   return chart.colors.getIndex(target.dataItem.index);
    // });
    //
    // // Cursor
    // chart.cursor = new am4charts.XYCursor();
    //
    // }); // end am4core.ready()



  });
})();
