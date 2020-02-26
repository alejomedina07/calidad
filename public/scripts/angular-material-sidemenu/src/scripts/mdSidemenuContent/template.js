export default function() {

  return `
    <div class="md-sidemenu-content" layout="column">
      <md-button class="md-sidemenu-toggle" ng-if="$mdSidemenuContent.heading" ng-click="$mdSidemenuContent.changeState();" ng-class="{ 'md-active': $mdSidemenuContent.visible }">
        <div layout="row">
          <md-icon ng-if="$mdSidemenuContent.icon" md-svg-src='static/content/icons/{{ $mdSidemenuContent.icon }}.svg' ></md-icon>
          <span flex>{{ $mdSidemenuContent.heading }}</span>
          <md-icon ng-if="$mdSidemenuContent.arrow" md-svg-src='static/content/icons/abajo.svg'></md-icon>
        </div>
      </md-button>

      <div class="md-sidemenu-wrapper" md-sidemenu-disable-animate ng-class="{ 'md-active': $mdSidemenuContent.visible, 'md-sidemenu-wrapper-icons':  $mdSidemenuContent.icon }" layout="column" ng-transclude></div>
    </div>
  `;

}
