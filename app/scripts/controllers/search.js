'use strict';

/**
 *
 *
 */
angular.module('gulveonlineApp')
  .controller('SearchCtrl', ['$scope', '$http', '$timeout', 'ESPBA', 'Lookup', 'Meta',
	function($scope, $http, $timeout, ESPBA, Lookup, Meta) {

		$scope.sortering = false;
		$scope.sorteringItems = [
			{ id: 'pris_enhed', navn: 'Laveste m² pris' },
			{ id: 'paa_lager', navn: 'Antal m² på lager' },
			{ id: 'sort_id', navn: 'Træsorter' }
		];

		Meta.setTitle('Søgning');
		Meta.setDescription('Søg på gulve.online. Foretag en mere kompleks søgning ved at skrive flere søgeord adskilt af mellemrum.');

		$scope.produkter = [];

		//produktList properties
		$scope.produktList = {};
		$scope.produktList.title = 'Søgning';

		var doSearch = function(term) {
			//just reuse ESPBA settings
			var url = ESPBA.getHost() + 'api/search.php';
			$http({
				url: url,
				method: 'GET',
				params: { term: term }
			}).then(function(res) {
				$scope.produkter = res.data;
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
		}

		var term = angular.element('#search-input').val();
		if (term) {
			$scope.produktList.desc = '<h4>' + term.split(' ').join(' + ') + '</h4>';
			doSearch(term);
		}

}]);

