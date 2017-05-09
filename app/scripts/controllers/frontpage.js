'use strict';

/**
 *
 *
 */
angular.module('gulveonlineApp')
  .controller('FrontpageCtrl', ['$scope', '$q', '$routeParams', '$timeout', 'ESPBA', 'Lookup', 'Meta', 'Utils',
	function($scope, $q, $routeParams, $timeout, ESPBA, Lookup, Meta, Utils) {

		$scope.produkter = [];
		
		Meta.setTitle('gulve.online - import og produktion af kvalitets trægulve');
		Meta.setDescription('Førende importør af massive plankegulve, parketstave, sildeben og mosaik. Vores leverandører er baseret på FSC-certificeret skovdrift.');

		function initProdukter() {
			$scope.produkter.forEach(function(produkt) {
				Lookup.formatProdukt(produkt);				
			});
		}
				
		ESPBA.get('produkter', { aktiv: 1, forside: 1 }, { limit: 12, orderBy : { field: 'edited_timestamp', order: 'desc' }}).then(function(r) {
			$scope.produkter = r.data;
			var newLimit = 12-$scope.produkter.length;
			if (newLimit>0) {
				ESPBA.get('produkter', { aktiv: 1, forside: 0 }, { limit: newLimit, orderBy : 'rand()' }).then(function(r) {
					$scope.produkter = $scope.produkter.concat(r.data);
					initProdukter();
				});
			} else {
				initProdukter();
			}
		});

		$scope.getBackgroundStyle = function(produkt) {
			return {		
				'background-image':'url(' + produkt.billede + ')'
			};
		};


}]);
