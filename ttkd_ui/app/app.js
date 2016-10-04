(function() {
  'use strict';

  angular.module('ttkdApp',
    [
			'ui.router',
      'ttkdApp.routes',
      'ttkdApp.mainCtrl',
      'ttkdApp.navCtrl',
      'ttkdApp.checkinCtrl',
			'ttkdApp.partials',
			'ttkdApp.registrationFormDirective'
    ]
  );

})();
