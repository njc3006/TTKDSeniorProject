(function() {
  'use strict';

  angular.module('ttkdApp',
    [
		'ui.router',
		'ui.bootstrap',
		'formly',
		'formlyBootstrap',
		'formlyRepeatingSection',
		'ttkdApp.routes',
		'ttkdApp.mainCtrl',
		'ttkdApp.navCtrl',
		'ttkdApp.checkinCtrl',
		'ttkdApp.partials',
		'ttkdApp.homeCtrl',
		'ttkdApp.fieldsService',
		'ttkdApp.classlistCtrl'
    ]
  )
	.constant('apiHost', 'localhost:8000')
	.config(['formlyConfigProvider', function(formlyConfigProvider) {
		formlyConfigProvider.setType({
			name: 'waiver',
			templateUrl: 'registration/waiver/waivertext.html'
		});

		formlyConfigProvider.setType({
			name: 'review',
			templateUrl: 'registration/review/reviewRegistration.html'
		});
	}]);
})();
