'use strict';

/**
 * @ngdoc function
 * @name gulveonlineApp.service:ProduktModal
 * @description
 * #ProduktModal
 * Controller of the gulveonlineApp
 */
angular.module('gulveonlineApp').factory('ProduktModal', function($modal, $q, ESPBA, UploadModal, Lookup) {

	var deferred = null,
			modal = null;

	return {

		isShown: function() {
			return modal != null;
		},
		show: function($scope, produkt_id) {
			deferred = $q.defer()
			$scope.__produktModal = {
				title: produkt_id ? 'Rediger produkt' : 'Opret nyt Produkt',
				btnOk: produkt_id ? 'Gem og luk' : 'Opret produkt og luk'
			};

			$scope.edit = {};
			if (produkt_id) {
				ESPBA.get('produkter', { id: produkt_id }).then(function(r) {
					$scope.edit = r.data[0];
					$scope.reloadBilleder();
				})
			};
			$scope.$watch('edit.enhed_id', function() {
				$scope.enhedFlertal = Lookup.enhedNavnFlertal($scope.edit.enhed_id);
				$scope.enhedEntal = Lookup.enhedNavn($scope.edit.enhed_id);
			});

			$scope.canSave = function() {
				return $scope.edit.pris_enhed != undefined &&
					$scope.edit.enhed_id != undefined &&
					$scope.edit.paa_lager != undefined &&
					$scope.edit.navn != undefined &&
					$scope.edit.kategori_id != undefined
			}

			//$scope.sortItems = Lookup.sortItems();
			$scope.sortItems = [{ id: 0, navn: '--'}].concat(Lookup.sortItems());

			$scope.kategoriItems = Lookup.kategoriItems();
			$scope.enhedItems = Lookup.enhedItems();
			$scope.kvalitetItems = Lookup.kvalitetItems();
			$scope.overfladeItems = Lookup.overfladeItems();
			$scope.produktTypeItems = Lookup.produktTypeItems();

			modal = $modal({
				scope: $scope,
				templateUrl: 'views/produkt.modal.html',
				backdrop: 'static',
				show: false,
				keyboard: false
			})

			$scope.reloadBilleder = function() {
				$scope.billeder = [];
				if (!$scope.edit.id) {
					$scope.$apply();
					return
				}
				ESPBA.get('billeder', { produkt_id: $scope.edit.id }).then(function(r) {
					$scope.billeder = r.data;
				})
			};

			$scope.addBillede = function() {
				UploadModal.show($scope).then(function(r) {	
					var data = {
						path: r.filename,
						produkt_id: $scope.edit.id
					};
					ESPBA.insert('billeder', data).then(function(r) {
						$scope.reloadBilleder();
					})
				})
			}
				
			modal.$promise.then(function() {
			})

			modal.$promise.then(modal.show).then(function() {
				//
			})

			$scope.produktModalClose = function(value) {

				function close() {
					modal.hide();
					modal.destroy();
					modal = null;
		      deferred.resolve(value)
				}

				if (value) {
					if (produkt_id) {
						ESPBA.update('produkter', $scope.edit).then(function(r) {
							close()
						})
					} else {
						ESPBA.insert('produkter', $scope.edit).then(function(r) {
							close()
						})
					}
				} else {
					close()
				}
			}

			angular.element('body').on('keydown', function(e) {
				if (e.charCode == 27) $scope.produktModalClose(false)
			})

      return deferred.promise;
		}

	}

});


