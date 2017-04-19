'use strict';

/**
 * @ngdoc function
 * @name gulveonlineApp.controller:KategoriCtrl
 * @description
 * #Kategori
 * Controller of the gulveonlineApp
 */
angular.module('gulveonlineApp')
  .controller('KategoriCtrl', ['$scope', '$routeParams', '$timeout', 'ESPBA', 'Lookup', 'Meta',
	function($scope, $routeParams, $timeout, ESPBA, Lookup, Meta) {

		var id = $routeParams.id;

		$scope.sortering = false;
		$scope.sorteringItems = [
			{ id: 'pris_enhed', navn: 'Laveste m² pris' },
			{ id: 'paa_lager', navn: 'Antal m² på lager' },
			{ id: 'sort_id', navn: 'Træsorter' }
		];

		ESPBA.get('kategori', { id: id }).then(function(r) {
			$scope.kategori = r.data[0];
			Meta.setTitle($scope.kategori.navn);
			Meta.setDescription($scope.kategori.beskrivelse || $scope.kategori.navn);
		})

		ESPBA.get('produkter', { kategori_id: id, aktiv: 1 }).then(function(r) {
			$scope.produkter = r.data;
			$scope.produkter.forEach(function(p) {
				p.sort = Lookup.sortNavn(p.sort_id).toLowerCase();
				p.enhed = Lookup.enhedNavn(p.enhed_id);
				p.overflade = Lookup.overfladeNavn(p.overflade_id);
				p.kvalitet = Lookup.kvalitetNavn(p.kvalitet_id);

				ESPBA.get('billeder', { produkt_id: p.id }).then(function(b) {
					if (b.data.length) {
						p.billede = b.data[0]
					} else {
						p.billede = { path: 'default-picture.jpg' }
					}
				})
			})
		});

}]);

