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
			{ id: 'sortPrice', navn: 'Laveste m² pris' },
			{ id: 'paa_lager', navn: 'Antal m² på lager' },
			{ id: 'sort', navn: 'Træsorter' }
			//{ id: 'kategori', navn: 'Gulvtype' }
		];

		ESPBA.get('kategori', { id: id }).then(function(r) {
			$scope.kategori = r.data[0];

			$scope.produktList.title = $scope.kategori.navn;
			$scope.produktList.desc = $scope.kategori.beskrivelse;

			Meta.setTitle($scope.kategori.meta_title || $scope.kategori.navn);
			Meta.setDescription($scope.kategori.meta_desc || $scope.kategori.beskrivelse || $scope.kategori.navn);
		});

		ESPBA.get('produkter', { kategori_id: id, aktiv: 1 }, { orderBy : { field: 'edited_timestamp', order: 'desc' }}).then(function(r) {
			$scope.produkter = r.data;
			$scope.produkter.forEach(function(p) {
				Lookup.formatProdukt(p);
			});
		});

}]);

