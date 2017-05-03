'use strict';

/**
 *
 *
 */
angular.module('gulveonlineApp')
  .controller('IndeksCtrl', ['$scope', 'ESPBA', 'Utils', 'Meta', function($scope, ESPBA, Utils, Meta) {

		Meta.setTitle('Produktoversigt, samtlige kategorier og produkter');
		Meta.setDescription('Samtlige kategorier og produkter: Sildeben, massiv plank, mosaik ruder, terrasseplank, lamelplank, højkantparket mv');

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

						var count = function(katArray) {
							var c = 0;
							katArray.forEach(function(k) {
								c+= 3; //kategori header fills 3
								c+= k.produkter.length;
							});
							return c;
						}

						var total = count($scope.kategorier);
						var colSize = Math.max(total / 3)-5;
						console.log(total, colSize);

						var columns = { one: [], two: [], three: [] };
						$scope.kategorier.forEach(function(k) {
							if (count(columns.one)<colSize) {
								columns.one.push(k);
							} else if (count(columns.two)<colSize) {
								columns.two.push(k);
							} else {
								columns.three.push(k);
							}
						});
						$scope.columns = columns;

					}

				});
			});
		});


}]);
