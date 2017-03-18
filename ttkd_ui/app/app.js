(function() {
  'use strict';

  angular.module('ttkdApp',
    [
		'ui.router',
		'ui.bootstrap',
		'ttkdApp.constants',
		'ttkdApp.routes',
		'ttkdApp.mainCtrl',
		'ttkdApp.navCtrl',
		'ttkdApp.checkinCtrl',
		'ttkdApp.partials',
		'ttkdApp.homeCtrl',
		'ttkdApp.registationCtrl',
		'ttkdApp.studentlistCtrl',
		'ttkdApp.studentDetailCtrl',
		'ttkdApp.attendanceCtrl',
		'ttkdApp.editStudentCtrl',
		'ttkdApp.importExportCtrl',
		'ttkdApp.beltsStripesCtrl',
		'ttkdApp.studentWaiverCtrl',
		'ttkdApp.programsCtrl',
		'ttkdApp.AuthInterceptor'
    ]
  ).config(['$httpProvider', function($httpProvider) {
    	$httpProvider.interceptors.push('AuthInterceptor');
	} ]);

})();
