'use strict';

/**
 *
 *
 */
angular.module('gulveonlineApp')
  .controller('OversigtCtrl', ['$scope', '$routeParams', '$window', 'ESPBA', 'Lookup', 'Meta', 'Utils',
	function($scope, $routeParams, $window, ESPBA, Lookup, Meta, Utils) {

		if (!$routeParams.type || !$routeParams.navn || !$routeParams.id) {
			$window.location.href = '/';
		}

		$scope.sortering = false;
		$scope.sorteringItems = [
			{ id: 'sortPrice', navn: 'Laveste m² pris' },
			{ id: 'paa_lager', navn: 'Antal m² på lager' }
		];
			
		var id = $routeParams.id;
		var navn = $routeParams.navn.replace(/-/g, ' ');
		$scope.produktList = {};

		var table;
		switch ($routeParams.type) {
			case 'traesort' : 
				table = 'sort'; 
				$scope.produktList.title = 'Træsort '+ Lookup.sortNavn(id).toLowerCase();
				break;
			case 'overflade-behandling' :
				table = 'overflade'; 
				$scope.produktList.title = Lookup.overfladeNavn(id) + ' overflade';
				break;
			case 'profil' :
				table = 'profil'; 
				$scope.produktList.title = Lookup.profilNavn(id) + ' profil';
				break;
			case 'sortering' :
				table = 'kvalitet'; 
				$scope.produktList.title = Lookup.kvalitetNavn(id) + ' sortering';
				break;

			default :
				//should never happen
				table = $routeParams.type;
				break;
		}

		if (table != ' sort') {
			$scope.sorteringItems.push(	{ id: 'sort', navn: 'Træsorter' } );
		}

		var field = table + '_id';
		
		ESPBA.get(table, { id: id }).then(function(r) {
			$scope.produktList.desc = r.data[0].beskrivelse;
		});

		var search = { aktiv: 1 };
		search[field] = id;

		ESPBA.get('produkter', search ).then(function(r) {
			$scope.produkter = r.data;

			for (var i=0, l=$scope.produkter.length; i<l; i++) {
				var p = $scope.produkter[i];
				Lookup.formatProdukt(p);

				ESPBA.get('billeder', { produkt_id: p.id }, { limit: 1, orderBy : 'rand()' } ).then(function(b) {
					if (b.data.length) {
						p.billede = 'media-uploads/'+b.data[0].path;
					} else {
						p.billede = 'images/default-picture.jpg';
					}
				});
				ESPBA.get('tilbud', { produkt_id: p.id }, { limit: 1 } ).then(function(b) {
					if (b.data.length) {
						p.tilbud_pris_enhed = b.data[0].tilbud_pris_enhed;
					}
				});

				if (i == l-1) {
					$scope.gulvtypeItems = Lookup.filterByProduktList($scope.produkter);
				}
			}
			
		});

	

}]);

