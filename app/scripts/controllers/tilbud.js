'use strict';

/**
 *
 *
 */
angular.module('gulveonlineApp')
  .controller('TilbudCtrl', ['$scope', '$http', '$timeout', 'ESPBA', 'Lookup', 'Meta',
	function($scope, $http, $timeout, ESPBA, Lookup, Meta) {

		$scope.sortering = false;
		$scope.sorteringItems = [
			{ id: 'pris_enhed', navn: 'Laveste m² pris' },
			{ id: 'paa_lager', navn: 'Antal m² på lager' },
			{ id: 'sort_id', navn: 'Træsorter' }
		];

		$scope.produkter = [];

		Meta.setTitle('Aktuelle Tilbud');
		Meta.setDescription('Tilbud og restpartier indenfor plank, stav, sildeben, mosaik mv. Altsammen massiv eg, ask, ipe, moseeeg og andre træsorter');

		//produktList properties
		$scope.produktList = {};
		$scope.produktList.title = 'Aktuelle Tilbud';
		$scope.produktList.desc = 'Gælder så længe lager laves. Klik på produktet for at se lagerbeholdning og evt. leveringstid.';
		
		ESPBA.get('produkter', { produkt_type_id: 2 }).then(function(r) {
			$scope.produkter = r.data;
			$scope.produkter.forEach(function(p) {
				p.kategori = Lookup.kategoriNavn(p.kategori_id);
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

