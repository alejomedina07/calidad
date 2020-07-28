(function(){
  'use strict';

  app.controller('listControl', function($scope, $http, $timeout, $mdDialog, ToastFactoria, $filter){
    var $cCtrl = this;
    $cCtrl.pagina = 0;
    $cCtrl.idEliminar = 0;
    $cCtrl.registrosXpagina = 10;
    $cCtrl.filtros = {};




    $cCtrl.listarCentros = function () {
      $cCtrl.loading = true;
      $http.get('/chequeo/control/listar')
      .then(function(result){
        $cCtrl.registros = result.data;
        $cCtrl.registrosFiltrados = $cCtrl.registros;
        $cCtrl.paginar();
        $cCtrl.loading = false;
      })
      .catch(function(e){
        $cCtrl.loading = false;
        console.log(e);
      });
    };

    $cCtrl.filtrar = function() {
      $cCtrl.centrosFiltrados = $filter('filter')($cCtrl.centros, $cCtrl.search);
      $cCtrl.paginar();
    };


    $cCtrl.paginar = function() {
      $cCtrl.totalPaginas = Math.ceil($cCtrl.centrosFiltrados.length/$cCtrl.registrosXpagina);
    };


    $cCtrl.ordenarPor = function (campo) {
      $cCtrl.reverse = ($cCtrl.propertyName === campo) ? !$cCtrl.reverse : false;
      $cCtrl.propertyName = campo;
    }


    $cCtrl.obtenerLinea = function (linea) {
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

    $cCtrl.listarCentros();




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
