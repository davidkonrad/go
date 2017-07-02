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

		function init() {
			ESPBA.get('produkter', { aktiv: 1, produkt_type_id: 3 }, { orderBy : { field: 'edited_timestamp', order: 'desc' }} ).then(function(r) {
				$scope.produkter = r.data;
				for (var i=0, l=$scope.produkter.length; i<l; i++) {
					Lookup.formatProdukt($scope.produkter[i]);
					if (i == l-1) {
						$scope.gulvtypeItems = Lookup.filterByProduktList($scope.produkter);
					}
				}
			});
		}

		Lookup.init().then(function() {
			init();
		});


}]);

