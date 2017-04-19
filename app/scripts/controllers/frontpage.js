'use strict';

/**
 *
 *
 */
angular.module('gulveonlineApp')
  .controller('FrontpageCtrl', ['$scope', '$routeParams', '$timeout', 'ESPBA', 'Lookup', 
	function($scope, $routeParams, $timeout, ESPBA, Lookup) {

		
		ESPBA.get('produkter', { aktiv: 1, forside: 1 }, { limit: 12, orderBy : { field: 'edited_timestamp', order: 'desc' }}).then(function(r) {
			$scope.produkter = r.data
			var newLimit = 12-$scope.produkter.length;
			if (newLimit>0) ESPBA.get('produkter', { aktiv: 1 }, { limit: newLimit, orderBy : { field: 'edited_timestamp', order: 'desc' }}).then(function(r) {
				$scope.produkter = $scope.produkter.concat(r.data)
			})
		})



}]);
