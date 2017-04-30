'use strict';

/**
 *
 *
 */
angular.module('gulveonlineApp')
  .controller('FrontpageCtrl', ['$scope', '$q', '$routeParams', '$timeout', 'ESPBA', 'Lookup', 'Meta', 'Utils',
	function($scope, $q, $routeParams, $timeout, ESPBA, Lookup, Meta, Utils) {

		$scope.produkter = [];
		
		Meta.setTitle('Massive plankegulve, stavparket, sildeben, mosaik, terrasseplank');
		Meta.setDescription('gulve.online er førende importør af massive plankegulve, parketstave, sildeben og mosaik. De fleste produkter er baseret på bæredygtig FSC-certificeret skovdrift');

		function initProdukter() {
			$scope.produkter.forEach(function(produkt) {

				Lookup.formatProdukt(produkt);				

				ESPBA.get('billeder', { produkt_id: produkt.id }, { limit: 1, orderBy : 'rand()' }).then(function(img) {
					if (img.data.length>0 && img.data[0].path !== undefined) {
						produkt.image = 'media-uploads/' + img.data[0].path;
					} else {
						produkt.image = 'images/default-picture.jpg';
					}
				});

				//tilbud
				if (produkt.produkt_type_id == 2) {
					ESPBA.get('tilbud', { produkt_id: produkt.id }, { limit: 1 }).then(function(tilbud) {
						if (tilbud.data.length) {
							produkt.tilbud_pris_enhed = tilbud.data[0].tilbud_pris_enhed;
						}
					});
				}

			});
		}
				
		ESPBA.get('produkter', { aktiv: 1, forside: 1 }, { limit: 12, orderBy : { field: 'edited_timestamp', order: 'desc' }}).then(function(r) {
			$scope.produkter = r.data;
			var newLimit = 12-$scope.produkter.length;
			if (newLimit>0) {
				ESPBA.get('produkter', { aktiv: 1, forside: 0 }, { limit: newLimit, orderBy : 'rand()' }).then(function(r) {
					$scope.produkter = $scope.produkter.concat(r.data);
					initProdukter();
				});
			} else {
				initProdukter();
			}
		});

		$scope.getBackgroundStyle = function(produkt) {
			return {		
				'background-image':'url(' + produkt.image + ')'
			};
		};


}]);
