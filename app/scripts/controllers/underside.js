'use strict';

/**
 *
 *
 */
angular.module('hallandparketApp')
  .controller('UndersideCtrl', ['$scope', '$location', 'ESPBA', 'Lookup', 'Meta',
	function($scope, $location, ESPBA, Lookup, Meta) {

		var path = $location.path().replace('/', '');

		ESPBA.get('undersider', { link : path }).then(function(r) {
			if (r.data.length) {
				$scope.underside = r.data[0];
				Meta.setTitle( $scope.underside.meta_title );
				Meta.setDescription( $scope.underside.meta_desc );
			}
		});

}]);

