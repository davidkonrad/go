'use strict';

/**
 * 
 * 
 * 
 */

angular.module('hallandparketApp').factory('AdminDataModal', function($modal, $q, ESPBA, Lookup) {

	var deferred = null,
			modal = null;

	return {

		isShown: function() {
			return modal != null;
		},
		show: function($scope, table, id, view, required) {
			deferred = $q.defer()
			$scope.__dataModal = {
				title: id ? 'Rediger '+table : 'Opret '+table,
				btnOk: id? 'Gem og luk' : 'Opret og luk'
			};

			$scope.edit = {};
			if (id) {
				ESPBA.get(table, { id: id }).then(function(r) {
					$scope.edit = r.data[0];
				})
			};

			$scope.canSave = function() {
				for (var i=0, l=required.length; i<l; i++) {
					if (!$scope.edit[required[i]] || $scope.edit[required[i]].length<=0) return false
				}
				return true
			}

			if (!modal) modal = $modal({
				scope: $scope,
				templateUrl: 'views/'+view,
				backdrop: 'static',
				show: false,
				keyboard: false
			});

			modal.$promise.then(function() {
			});

			modal.$promise.then(modal.show).then(function() {
				//
			});

			$scope.modalClose = function(value) {

				function close() {
					modal.hide();
					modal.destroy();
					modal = null;
		      deferred.resolve(value)
				}

				if (value) {
					if (id) {
						ESPBA.update(table, $scope.edit).then(function(r) {
							Lookup.init();
							close();
						});
					} else {
						ESPBA.insert(table, $scope.edit).then(function(r) {
							Lookup.init();
							close();
						})
					}
				} else {
					close();
				}
			}

			angular.element('body').on('keydown keypress', function(e) {
				if (e.charCode == 27) $scope.modalClose(false)
			});

      return deferred.promise;
		}

	}

});


