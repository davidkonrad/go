'use strict';

/**
 *
 *
 */
angular.module('gulveonlineApp')
  .controller('RestpartiCtrl', ['$scope', '$routeParams', '$timeout', 'ESPBA', 'Lookup', 'Meta', 'Utils',
	function($scope, $routeParams, $timeout, ESPBA, Lookup, Meta, Utils) {

		//produktList properties
		$scope.produktList = {};
		$scope.produktList.title = 'Restpartier';
		$scope.produktList.desc = 'gulve.online råder over +1.000 m² restpartier. Det er gulve i perfekt stand fra især storordrer, special-produktioner, udgåede gulve, særlige træsorter mv. Restpartier sælges til lav pris, helst i samlet mængde.';

		Meta.setTitle('Restpartier');
		Meta.setDescription('gulve.online råder over +1.000 m² restpartier. Det er gulve i perfekt stand fra især special-produktioner, udgåede gulve, specielle træsorter mv.');

		$scope.sortering = false;
		$scope.sorteringItems = [
			{ id: 'sortPrice', navn: 'Laveste m² pris' },
			{ id: 'paa_lager', navn: 'Antal m² på lager' },
			{ id: 'sort', navn: 'Træsorter' }
		];

		ESPBA.get('produkter', { aktiv: 1, produkt_type_id: 3 }).then(function(r) {
			$scope.produkter = r.data;
			$scope.produkter.forEach(function(p) {
				Lookup.formatProdukt(p);
			});
		});

}]);

