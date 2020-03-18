(function(){
  'use strict';
  app.factory('menu', [
    '$location',
    '$rootScope',
    function ($location) {

      var sections = [];

      sections.push({
        name: 'Notificaciones', permiso:'notificacion',
        type: 'toggle', icon:'phone',
        pages: [{
          name: 'Lista de Notificaciones',  permiso:'notificacion.listar',
          state: 'home.beers.ipas',
          type: 'link', icon: 'fa fa-group'
        }, {
          name: 'Crear Notificación',  permiso:'notificacion.crear',
          state: 'home.beers.porters',
          type: 'link', icon: 'fa fa-map-marker'
        }]
      });

      sections.push({
        name: 'Usuarios', permiso:'usuario',
        type: 'toggle', icon:'target',
        pages: [{
          name: 'Listar Usuarios',  permiso:'usuario.listar',
          state: 'home.beers.ipas',
          type: 'link', icon: 'fa fa-group'
        }, {
          name: 'Crear Usuarios',  permiso:'usuario.crear',
          state: 'home.beers.porters',
          type: 'link', icon: 'fa fa-map-marker'
        }]
      });


      sections.push({
        name: 'Centros de trabajo',  permiso:'centro',
        type: 'toggle', icon:'tools-menu',
        pages: [{
          name: 'Listar Centros de trabajo',  permiso:'centro.listar',
          state: 'munchies.cheetos',
          type: 'link', icon: 'fa fa-group'
        }, {
          name: 'Crear Centro de trabajo',  permiso:'centro.crear',
          state: 'munchies.bananachips',
          type: 'link', icon: 'fa fa-map-marker'
        }]
      });


      var self;

      return self = {
        sections: sections,

        toggleSelectSection: function (section) {
          self.openedSection = (self.openedSection === section ? null : section);
        },
        isSectionSelected: function (section) {
          return self.openedSection === section;
        },

        selectPage: function (section, page) {
          page && page.url && $location.path(page.url);
          self.currentSection = section;
          self.currentPage = page;
        }
      };

      function sortByHumanName(a, b) {
        return (a.humanName < b.humanName) ? -1 :
          (a.humanName > b.humanName) ? 1 : 0;
      }

    }])


  app.run(['$templateCache', function ($templateCache) {
      $templateCache.put('partials/menu-toggle.tmpl.html',
        '<md-button class="md-button-toggle"\n' +
        '  ng-click="toggle()"\n' +
        '  aria-controls="docs-menu-{{section.name | nospace}}"\n' +
        '  flex layout="row"\n' +
        '  aria-expanded="{{isOpen()}}">\n' +
        '<md-icon class="md-primary" md-svg-src="/static/content/icons/{{section.icon}}.svg"></md-icon>' +
        ' &nbsp; {{section.name}}\n' +
        '<span flex></span>' +
        '<md-icon ng-hide="isOpen()" class="md-primary icono-flechas" md-svg-src="/static/content/icons/abajo.svg"></md-icon>' +
        '<md-icon ng-show="isOpen()" class="md-primary icono-flechas" md-svg-src="/static/content/icons/arriba.svg"></md-icon>' +
        '</md-button>\n' +
        '<ul ng-show="isOpen()" id="docs-menu-{{section.name | nospace}}" class="menu-toggle-list">\n' +
        '  <li ng-repeat="page in section.pages">\n' +
        '    <menu-link section="page"></menu-link>\n' +
        '  </li>\n' +
        '</ul>\n' +
        '');
    }])
 .directive('menuToggle', ['$timeout', function ($timeout ) {
      return {
        scope: {
          section: '='
        },
        templateUrl: 'partials/menu-toggle.tmpl.html',
        link: function (scope, element) {
          var controller = element.parent().controller();

          scope.isOpen = function () {
            return controller.isOpen(scope.section);
          };
          scope.toggle = function () {
            controller.toggleOpen(scope.section);
          };

          var parentNode = element[0].parentNode.parentNode.parentNode;
          if (parentNode.classList.contains('parent-list-item')) {
            var heading = parentNode.querySelector('h2');
            element[0].firstChild.setAttribute('aria-describedby', heading.id);
          }
        }
      };
    }])

  app.run(['$templateCache', function ($templateCache) {
      $templateCache.put('partials/menu-link.tmpl.html',
        '<md-button ng-class="{\'{{section.icon}}\' : true}" ui-sref-active="active" \n' +
        '  ui-sref="{{section.state}}" ng-click="focusSection()">\n' +
        '  {{section | humanizeDoc}}\n' +
        '  <span  class="md-visually-hidden "\n' +
        '    ng-if="isSelected()">\n' +
        '    current page\n' +
        '  </span>\n' +
        '</md-button>\n' +
        '');
    }])
    .directive('menuLink', function () {
      return {
        scope: {
          section: '='
        },
        templateUrl: 'partials/menu-link.tmpl.html',
        link: function ($scope, $element) {
          var controller = $element.parent().controller();

          $scope.focusSection = function () {
            // set flag to be used later when
            // $locationChangeSuccess calls openPage()
            controller.autoFocusContent = true;
          };
        }
      };
    })
    .filter('nospace', function () {
      return function (value) {
        return (!value) ? '' : value.replace(/ /g, '');
      };
    })
    //replace uppercase to regular case
    .filter('humanizeDoc', function () {
      return function (doc) {
        if (!doc) return;
        if (doc.type === 'directive') {
          return doc.name.replace(/([A-Z])/g, function ($1) {
            return '-' + $1.toLowerCase();
          });
        }

        return doc.label || doc.name;
      };
  });
})();
