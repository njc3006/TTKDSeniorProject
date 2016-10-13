(function() {
  'use strict';

  angular.module('ttkdApp',
    [
		'ui.router',
		'ui.bootstrap',
		'ui.select',
		'ttkdApp.constants',
		'ttkdApp.routes',
		'ttkdApp.mainCtrl',
		'ttkdApp.navCtrl',
		'ttkdApp.checkinCtrl',
		'ttkdApp.partials',
		'ttkdApp.homeCtrl',
		'ttkdApp.stateService',
		'ttkdApp.programsService'
    ]
  );
})();
