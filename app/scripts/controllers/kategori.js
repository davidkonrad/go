'use strict';

/**
 *
 *
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
		});

		ESPBA.get('produkter', { kategori_id: id, aktiv: 1 }).then(function(r) {
			$scope.produkter = r.data;
			$scope.produkter.forEach(function(p) {
				p.sort = Lookup.sortNavn(p.sort_id).toLowerCase();
				p.enhed = Lookup.enhedNavn(p.enhed_id);
				p.overflade = Lookup.overfladeNavn(p.overflade_id);
				p.kvalitet = Lookup.kvalitetNavn(p.kvalitet_id);
				p.profil = Lookup.profilNavn(p.profil_id);

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

