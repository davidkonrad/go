'use strict';

/**
 *
 *
 */
angular.module('gulveonlineApp')
  .controller('IndeksCtrl', ['$scope', 'ESPBA', 'Utils', 'Meta', function($scope, ESPBA, Utils, Meta) {

		Meta.setTitle('Produktoversigt, samtlige kategorier og produkter');

		ESPBA.get('kategori', { aktiv: 1 }, { orderBy: 'navn' }).then(function(r) {
			var kategorier = r.data;
			var loop = 0;
			kategorier.forEach(function(k) {
				k.urlName = Utils.urlName(k.navn);

				ESPBA.get('produkter', { kategori_id: k.id, aktiv: 1 }, { orderBy: 'navn'}).then(function(r) {
					loop++;
					k.produkter = r.data;
					k.produkter.forEach(function(p) {
						p.urlName = Utils.urlName(p.navn);
					});

					//filter out empty kategorier
					if (loop === kategorier.length) {
						$scope.kategorier = kategorier.filter(function(k) {
							return k.produkter.length>0;
						});
					}

				});
			});
		});


}]);
