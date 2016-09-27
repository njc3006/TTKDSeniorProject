'use strict';

// Declare app level module which depends on views, and components
angular.module('ttkdApp', [
	'ui.router'
]).config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.otherwise('/home');

	$stateProvider
        // HOME STATES AND NESTED VIEWS ========================================
        .state('home', {
            url: '/home',
			templateUrl: 'home/home.html'
        });
}]);
