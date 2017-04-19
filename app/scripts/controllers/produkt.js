'use strict';

/**
 * @ngdoc function
 * @name gulveonlineApp.controller:ProduktCtrl
 * @description
 * #Produkt
 * Controller of the gulveonlineApp
 */
angular.module('gulveonlineApp')
  .controller('ProduktCtrl', ['$scope', '$routeParams', '$timeout', 'ESPBA', 'Lookup', 'Meta',
	function($scope, $routeParams, $timeout, ESPBA, Lookup, Meta) {

		var id = $routeParams.id;
		$scope.produkt = {};

		ESPBA.get('produkter', { id: id }).then(function(r) {
			$scope.produkt = r.data[0];

			Meta.setTitle($scope.produkt.navn);

			$scope.produkt.kategori = Lookup.kategoriNavn($scope.produkt.kategori_id); 
			$scope.produkt.traesort = Lookup.sortNavn($scope.produkt.sort_id); 
			$scope.produkt.kvalitet = Lookup.kvalitetNavn($scope.produkt.kvalitet_id); 
			$scope.produkt.overflade = Lookup.overfladeNavn($scope.produkt.overflade_id); 
			$scope.produkt.enhed = Lookup.enhedNavn($scope.produkt.enhed_id)
			$scope.produkt.enhed_spec = Lookup.enhedSpecifikation($scope.produkt.enhed_id)

			//console.log($scope.produkt)

			var meta = $scope.produkt.navn + '.';
			if ($scope.produkt.kategori) meta += $scope.produkt.kategori + '. ';
			if ($scope.produkt.traesort) meta += 'Træsort '+ $scope.produkt.traesort.toLowerCase() + '. ';
			if ($scope.produkt.dimension) meta += 'Dim. '+ $scope.produkt.dimension + '. ';
			if ($scope.produkt.kvalitet) meta += $scope.produkt.dimension + ' sortering. ';
			if ($scope.produkt.overflade) meta += $scope.produkt.overflade + '. ';
			if ($scope.produkt.pris_enhed && $scope.produkt.enhed) meta += 'DKK '+ $scope.produkt.pris_enhed + ' /' + $scope.produkt.enhed + '. ';

			Meta.setDescription(meta);

		})
		ESPBA.get('billeder', { produkt_id: id }).then(function(r) {
			$scope.billeder = r.data;
		})
	
  }]);
