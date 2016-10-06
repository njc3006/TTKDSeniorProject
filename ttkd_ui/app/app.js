(function() {
  'use strict';

  angular.module('ttkdApp',
    [
      'ttkdApp.routes',
      'ttkdApp.directives',
      'ttkdApp.mainCtrl',
      'ttkdApp.navCtrl',
      'ttkdApp.checkinCtrl',
			'ttkdApp.partials',
			'ttkdApp.fieldsService',
			'formly',
			'formlyBootstrap',
			'formlyRepeatingSection',
			'ui.bootstrap'
    ]
  ).config(['formlyConfigProvider', function(formlyConfigProvider) {
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
