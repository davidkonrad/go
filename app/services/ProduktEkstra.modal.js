'use strict';

/**
 *
 *
 */
angular.module('gulveonlineApp').factory('ProduktEkstraModal', ['$modal', '$q',	function($modal, $q) {

	var modal;
	var deferred;
	var local = this;

	local.modalInstance = ['$scope', 'ESPBA', 'produkt_id', 'produkt_ekstra_id', function($scope, ESPBA, produkt_id, produkt_ekstra_id) {

		$scope.produkt_id = produkt_id || false;
		$scope.produkt_ekstra_id = produkt_ekstra_id || false;

		$scope.title = produkt_ekstra_id ? 'Rediger ekstra egenskab' : 'Tilføj ekstra egenskab';
		$scope.btnOk = produkt_ekstra_id ? 'Gem' : 'Opret'; 
		$scope.edit = {
			produkt_id: produkt_id,
			sort_order: 100
		};
		if (produkt_ekstra_id) {
			ESPBA.get('produkt_ekstra', { id: produkt_ekstra_id }).then(function(res) {
				$scope.edit = res.data[0];
			})
		}

		$scope.canSave = function() {
			return $scope.edit.key != '' && $scope.edit.value != ''
		}

		function updateProduktEditedTimeStamp() {
			var params = {
				id: produkt_id,
				edited_timestamp: 'CURRENT_TIMESTAMP'
			}
			ESPBA.update('produkter', params).then(function(r) {
				//
			})
		}

		$scope.modalClose = function(value) {

			function close() {
				modal.hide();
				modal.destroy();
				modal = null;
	      deferred.resolve(value)
			}

			if (value) {
				if (produkt_ekstra_id) {
					ESPBA.update('produkt_ekstra', $scope.edit).then(function(r) {
						close()
					})
				} else {
					ESPBA.insert('produkt_ekstra', $scope.edit).then(function(r) {
						close()
					})
				}
				updateProduktEditedTimeStamp()
			} else {
				close()
			}
		};

	
	}];

	return {
		show: function(produkt_id, produkt_ekstra_id) {
			deferred = $q.defer();
			modal = $modal({
				controller: local.modalInstance,
				templateUrl: 'views/admin.produkt.ekstra.modal.html',
				backdrop: 'static',
				locals: { 
					produkt_id: produkt_id,
					produkt_ekstra_id: produkt_ekstra_id
				}
			});
      return deferred.promise;
		}

	}

}]);	



