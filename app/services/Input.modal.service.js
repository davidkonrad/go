'use strict';

/**
 *
 *
 */
angular.module('hallandparketApp').factory('InputModal', ['$modal', '$q',	function($modal, $q) {

	var modal;
	var deferred;
	var local = this;

	local.modalInstance = ['$scope', 'ESPBA', 'Lookup', 'options', function($scope, ESPBA, Lookup, options) {

		/*
		options {
			title: 
			desc:
			value:
			placeholder:
			type: float | int  | string | date
		}
		*/

		$scope.options = options
		
		$scope.canSave = function() {
			return $scope.options.value != null
		}

		$scope.modalClose = function(value) {
			modal.hide();
			modal.destroy();
			modal = null;
      deferred.resolve(value)
		};
	
	}];

	return {
		show: function(options) {
			deferred = $q.defer();
			modal = $modal({
				controller: local.modalInstance,
				templateUrl: 'views/Input.modal.service.html',
				backdrop: 'static',
				locals: { 
				 options: options
				}
			});
      return deferred.promise;
		}

	}

}]);	


