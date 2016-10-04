(function() {
	'use strict';

	function FormService(basicInfoFields, emergencyContactFields) {
		return {
			getForm: function(id) {
				var fields = [];

				switch (id) {
					case 'basic_info': fields = basicInfoFields; break;
					case 'emergency_contacts': fields = emergencyContactFields; break;
					case 'waiver': fields = []; break;
					default: fields = null; break;
				}

				return fields;
			}
		};
	}

	FormService.$inject = ['basic_info', 'emergency_contacts'];
	angular.module('ttkdApp.registrationFormDirective')
		.factory('FormService', FormService);
})();
