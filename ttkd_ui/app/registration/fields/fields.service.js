(function() {
	'use strict';

	function FieldsService(basicInfoFields, emergencyContactFields, waiverFields) {
		return {
			getForm: function(id) {
				var fields = [];

				switch (id) {
					case 'basic_info': fields = basicInfoFields; break;
					case 'emergency_contacts': fields = emergencyContactFields; break;
					case 'waiver': fields = waiverFields; break;
					default: fields = null; break;
				}

				return fields;
			}
		};
	}

	FieldsService.$inject = ['basic_info', 'emergency_contacts', 'waiver'];
	angular.module('ttkdApp.fieldsService', [])
		.factory('FieldsService', FieldsService);
})();
