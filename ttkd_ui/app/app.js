(function() {
  'use strict';

  angular.module('ttkdApp',
    [
		'ui.router',
		'ui.bootstrap',
		'ttkdApp.routes',
		'ttkdApp.mainCtrl',
		'ttkdApp.navCtrl',
		'ttkdApp.checkinCtrl',
		'ttkdApp.partials',
		'ttkdApp.homeCtrl'
    ]
  )
	.constant('apiHost', 'localhost:800');
})();
