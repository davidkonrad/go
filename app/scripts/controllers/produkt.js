'use strict';

/**
 *
 * 
 */
angular.module('gulveonlineApp')
  .controller('ProduktCtrl', ['$scope', '$routeParams', '$timeout', 'ESPBA', 'Lookup', 'Meta',
	function($scope, $routeParams, $timeout, ESPBA, Lookup, Meta) {

		var id = $routeParams.id;
		$scope.produkt = {};

		ESPBA.get('produkter', { id: id }).then(function(r) {
			$scope.produkt = r.data[0];

			//store current id for kontakt
			Lookup.setPassData({ produkt_navn: $scope.produkt.navn });

			Lookup.formatProdukt($scope.produkt);

			Meta.setTitle($scope.produkt.meta_title || $scope.produkt.navn);

			if ($scope.produkt.meta_desc) {
				Meta.setDescription($scope.produkt.meta_desc);
			} else {
				var meta = $scope.produkt.navn + '.';
				if ($scope.produkt.kategori) {
					meta += $scope.produkt.kategori + '. ';
				}
				if ($scope.produkt.sort) {
					meta += 'Træsort '+ $scope.produkt.sort.toLowerCase() + '. ';
				}
				if ($scope.produkt.dimension) {
					meta += 'Dim. '+ $scope.produkt.dimension + '. ';
				}
				if ($scope.produkt.kvalitet) {
					meta += $scope.produkt.dimension + ' sortering. ';
				}
				if ($scope.produkt.profil) {
					meta += $scope.produkt.profil + ' profil. ';
				}
				if ($scope.produkt.overflade) {
					meta += $scope.produkt.overflade + '. ';
				}
				if ($scope.produkt.pris_enhed && $scope.produkt.enhed) {
					meta += 'DKK '+ $scope.produkt.pris_enhed + ' /' + $scope.produkt.enhed + '. ';
				}
				Meta.setDescription(meta);
			}

		});


}]);
