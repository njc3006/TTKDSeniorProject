(function() {
	'use strict';

	function FieldsService(basicInfoFields, emergencyContactFields, waiverFields, reviewFields) {
		return {
			getForm: function(id) {
				var fields = [];

				switch (id) {
					case 'basic_info': fields = basicInfoFields; break;
					case 'emergency_contacts': fields = emergencyContactFields; break;
					case 'waiver': fields = waiverFields; break;
					default: fields = reviewFields; break;
				}

				return fields;
			}
		};
	}

	FieldsService.$inject = ['basic_info', 'emergency_contacts', 'waiver', 'review'];
	angular.module('ttkdApp.fieldsService', [])
		.factory('FieldsService', FieldsService);
})();
