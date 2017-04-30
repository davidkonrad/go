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
			{ id: 'sortPrice', navn: 'Laveste m² pris' },
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
					Lookup.formatProdukt(p);
				});
			});
		}

		var term = angular.element('#search-input').val();
		if (term) {
			$scope.produktList.desc = '<h4>' + term.split(' ').join(' + ') + '</h4>';
			doSearch(term);
		}

}]);

