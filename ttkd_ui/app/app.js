(function() {
  'use strict';

  angular.module('ttkdApp',
    [
		'ui.router',
		'ui.bootstrap',
		'ttkdApp.attendanceCtrl',
		'ttkdApp.AuthInterceptor',
		'ttkdApp.beltsStripesCtrl',
		'ttkdApp.checkinCtrl',
		'ttkdApp.constants',
		'ttkdApp.editStudentCtrl',
		'ttkdApp.homeCtrl',
		'ttkdApp.importExportCtrl',
		'ttkdApp.mainCtrl',
		'ttkdApp.manageUserCtrl',
		'ttkdApp.navCtrl',
		'ttkdApp.partials',
		'ttkdApp.registationCtrl',
		'ttkdApp.routes',
		'ttkdApp.studentDetailCtrl',
		'ttkdApp.studentlistCtrl',
		'ttkdApp.studentWaiverCtrl'
    ]
  ).config(['$httpProvider', function($httpProvider) {
    	$httpProvider.interceptors.push('AuthInterceptor');
	} ]);

})();
