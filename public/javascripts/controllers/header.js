

(function(){
  'use strict';

  app.controller('header', ['$scope', '$rootScope', '$mdSidenav', '$mdDialog','menu', function($scope, $rootScope, $mdSidenav, $mdDialog, menu){
    var $cCtr = this;

    $cCtr.MENU = MENU;

    $cCtr.operaciones = localStorage.getItem("operaciones");

    $cCtr.obtenerPermiso = function(permiso) {
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

    // var vm = this;
    var aboutMeArr = ['Family', 'Location', 'Lifestyle'];
    var budgetArr = ['Housing', 'LivingExpenses', 'Healthcare', 'Travel'];
    var incomeArr = ['SocialSecurity', 'Savings', 'Pension', 'PartTimeJob'];
    var advancedArr = ['Assumptions', 'BudgetGraph', 'AccountBalanceGraph', 'IncomeBalanceGraph'];

    //functions for menu-link and menu-toggle
    $cCtr.isOpen = isOpen;
    $cCtr.toggleOpen = toggleOpen;
    $cCtr.autoFocusContent = false;
    $cCtr.menu = menu;

    $cCtr.status = {
      isFirstOpen: true,
      isFirstDisabled: false
    };


    function isOpen(section) {
      return menu.isSectionSelected(section);
    }

    function toggleOpen(section) {
      menu.toggleSelectSection(section);
    }



  }]);
})();
