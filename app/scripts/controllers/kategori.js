'use strict';

/**
 *
 *
 */
angular.module('gulveonlineApp')
  .controller('KategoriCtrl', ['$scope', '$routeParams', '$timeout', 'ESPBA', 'Lookup', 'Meta', 'Utils',
	function($scope, $routeParams, $timeout, ESPBA, Lookup, Meta, Utils) {

		var id = $routeParams.id;

		//produktList properties
		$scope.produktList = {};

		$scope.sortering = false;
		$scope.sorteringItems = [
			{ id: 'pris_enhed', navn: 'Laveste m² pris' },
			{ id: 'paa_lager', navn: 'Antal m² på lager' },
			{ id: 'sort_id', navn: 'Træsorter' }
		];

		ESPBA.get('kategori', { id: id }).then(function(r) {
			$scope.kategori = r.data[0];

			$scope.produktList.title = $scope.kategori.navn;
			$scope.produktList.desc = $scope.kategori.beskrivelse;

			Meta.setTitle($scope.kategori.navn);
			Meta.setDescription($scope.kategori.beskrivelse || $scope.kategori.navn);
		});

		ESPBA.get('produkter', { kategori_id: id, aktiv: 1 }, { orderBy : { field: 'edited_timestamp', order: 'desc' }}).then(function(r) {
			$scope.produkter = r.data;
			$scope.produkter.forEach(function(p) {

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

			});
		});

}]);

