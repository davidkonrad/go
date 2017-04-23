'use strict';

/**
 *
 *
 */
angular.module('gulveonlineApp')
  .controller('FrontpageCtrl', ['$scope', '$q', '$routeParams', '$timeout', 'ESPBA', 'Lookup', 'Meta',
	function($scope, $q, $routeParams, $timeout, ESPBA, Lookup, Meta) {

		$scope.produkter = [];
		
		Meta.setTitle('Massive plankegulve, stavparket, sildeben, mosaik, terrasseplank');
		Meta.setDescription('gulve.online er førende importør af massive plankegulve, parketstave, sildeben og mosaik. De fleste produkter er baseret på bæredygtig FSC-certificeret skovdrift');
		function initProdukter() {
			$scope.produkter.forEach(function(produkt) {

				produkt.kategori = Lookup.kategoriNavn(produkt.kategori_id).trim();
				produkt.sort = Lookup.sortNavn(produkt.sort_id).trim();
				produkt.kvalitet = Lookup.kvalitetNavn(produkt.kvalitet_id).trim();
				produkt.overflade = Lookup.overfladeNavn(produkt.overflade_id).trim();
				produkt.enhed = Lookup.enhedNavn(produkt.enhed_id).trim();

				ESPBA.get('billeder', { produkt_id: produkt.id }, { limit: 1, orderBy : 'rand()' }).then(function(img) {
					if (img.data.length>0 && img.data[0].path != undefined) {
						produkt.image = 'media-uploads/' + img.data[0].path;
					} else {
						produkt.image = 'images/default-picture.jpg';
					}
				})
			})
		};
				
		ESPBA.get('produkter', { aktiv: 1, forside: 1 }, { limit: 12, orderBy : { field: 'edited_timestamp', order: 'desc' }}).then(function(r) {
			$scope.produkter = r.data
			var newLimit = 12-$scope.produkter.length;
			if (newLimit>0) {
				ESPBA.get('produkter', { aktiv: 1 }, { limit: newLimit, orderBy : { field: 'edited_timestamp', order: 'desc' }}).then(function(r) {
					$scope.produkter = $scope.produkter.concat(r.data)
					initProdukter();
				})
			} else {
				initProdukter();
			}
		});

/*
		function getMeta(url){   
			var defer = $q.defer();
	    var img = new Image();
			var direction;
	    img.addEventListener("load", function(){
				if (this.naturalWidth > this.naturalHeight) {
					direction =	'100% auto'
				} else {
					direction = 'auto 100%'
				}
	      defer.resolve( direction )
	    });
	    img.src = url;
      return defer.promise;
		}
		var processed = {};
		$scope.getBackgroundStyle = function(produkt) {
			if (processed[produkt.image]) return processed[produkt.image];
			getMeta(produkt.image).then(function(direction) {
				console.log(direction);
				var style = { 
					'background-image': 'url(' + produkt.image + ')', 
					'-webkit-background-size': direction,
					'-o-background-size': direction,
					'-moz-background-size': direction,
					'background-size': direction
				}; 
				processed[produkt.image] = style
				return {		
					style
					//'background-image':'url(' + produkt.image + ')'
				}
			})
		}
*/

		$scope.getBackgroundStyle = function(produkt) {
			//console.log(produkt.image)
			return {		
				'background-image':'url(' + produkt.image + ')'
			}
		}



}]);
