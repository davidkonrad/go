'use strict';

/**
 *
 *
 */
angular.module('gulveonlineApp')
  .controller('IndeksCtrl', ['$scope', 'ESPBA', function($scope, ESPBA) {

		ESPBA.get('kategori', { aktiv: 1 }, { orderBy: 'navn' }).then(function(r) {
			var kategorier = r.data;
			var total = 0;
			var loop = 0;
			kategorier.forEach(function(k) {
				ESPBA.get('produkter', { kategori_id: k.id, aktiv: 1 }, { orderBy: 'navn'}).then(function(r) {
					loop++;
					k.produkter = r.data;

					//filter out empty kategorier
					if (loop == kategorier.length) {
						$scope.kategorier = kategorier.filter(function(k) {
							return k.produkter.length>0
						})
					}
				})
			})
		})


}]);
