'use strict';

/**
 * @ngdoc function
 * @name gulveonlineApp.controller:ProduktCtrl
 * @description
 * #Produkt
 * Controller of the gulveonlineApp
 */
angular.module('gulveonlineApp')
  .controller('ProduktCtrl', ['$scope', '$routeParams', '$timeout', 'ESPBA', 'Lookup', 
	function($scope, $routeParams, $timeout, ESPBA, Lookup) {

		var id = $routeParams.id;
		$scope.produkt = {};

		ESPBA.get('produkter', { id: id }).then(function(r) {
			$scope.produkt = r.data[0];

			//update meta fields
			document.title = $scope.produkt.navn +' :: gulve.online';
			var desc = $scope.produkt.beskrivelse || $scope.produkt.navn;
			desc = $(desc).text();
			document.getElementsByName('description')[0].setAttribute('content', desc);

			$timeout(function() {
				$scope.produkt.kategori = Lookup.kategoriNavn($scope.produkt.kategori_id); 
				$scope.produkt.traesort = Lookup.sortNavn($scope.produkt.sort_id); 
				$scope.produkt.kvalitet = Lookup.kvalitetNavn($scope.produkt.kvalitet_id); 
				$scope.produkt.overflade = Lookup.overfladeNavn($scope.produkt.overflade_id); 
				$scope.produkt.enhed = Lookup.enhedNavn($scope.produkt.enhed_id)
			})
		})
		ESPBA.get('billeder', { produkt_id: id }).then(function(r) {
			$scope.billeder = r.data;
		})
	

  }]);
