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
			{ id: 'sort_id', navn: 'Træsorter' },
			{ id: 'kategori', navn: 'Gulvtype' }
		];

		Meta.setTitle('Søgning');
		Meta.setDescription('Søg på gulve.online. Foretag en mere kompleks søgning ved at skrive flere søgeord adskilt af mellemrum.');

		$scope.produkter = [];

		//produktList properties
		$scope.produktList = {};
		$scope.produktList.title = 'Søger ..';

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
				$timeout(function() {
					$scope.produktList.title = 'Søgning';
				});
			});
		}

		var term = angular.element('#search-input').val().trim();
		angular.element('#search-input').val(term);
		if (term) {
			doSearch(term);
			var terms = term.split(' ');
			for (var i=0; i<terms.length; i++) { terms[i] = terms[i].quote() };
			terms = terms.join(' + ');			
			$scope.produktList.desc = '<h4>' + terms + '</h4>';
		}

}]);

