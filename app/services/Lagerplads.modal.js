'use strict';

/**
 *
 *
 */
angular.module('hallandparketApp').factory('LagerpladsModal', ['$modal', '$q',	function($modal, $q) {

	var modal;
	var deferred;
	var local = this;

	local.modalInstance = ['$scope', 'ESPBA', 'Lookup', 'lagerplads_id', function($scope, ESPBA, Lookup, lagerplads_id) {

		$scope.lagerplads_id = lagerplads_id || false;
		$scope.items = Lookup.lagerpladsItems().filter(function(i) {
			if (!i.parent_id) return i
		})

		$scope.select_lagerplads_id = null;

		$scope.reset = function() {
			$('#selected_lagerplads').text('');
			$scope.select_lagerplads_id = null;
			$scope.lagerplads_id = null;
			$scope.items = Lookup.lagerpladsItems().filter(function(i) {
				if (!i.parent_id) return i
			})
		}

		$scope.$watch('select_lagerplads_id', function (_new, _old) {
			if (_new != _old) {

				if ($('#selected_lagerplads').text().trim() != '') {
					$('<i/>')
						.addClass('fa fa-chevron-right text-muted')
						.css({ 'margin-right': '6px', 'margin-left': '6px' })
						.appendTo('#selected_lagerplads')
				}					

				$('<label />', {
					'class': 'control-label',
					text: Lookup.lagerpladsNavn(_new)
				}).appendTo('#selected_lagerplads')

				$scope.lagerplads_id = _new;

				$scope.items = Lookup.lagerpladsItems().filter(function(i) {
					if (i.parent_id == _new) return i
				})

			}	
		})
		
		$scope.canSave = function() {
			return $scope.lagerplads_id != null
		}

		$scope.modalClose = function(value) {
			modal.hide();
			modal.destroy();
			modal = null;
      deferred.resolve(value)
		};
	
	}];

	return {
		show: function(lagerplads_id) {
			deferred = $q.defer();
			modal = $modal({
				controller: local.modalInstance,
				templateUrl: 'views/admin/LagerpladsModal.html',
				backdrop: 'static',
				locals: { 
					lagerplads_id: lagerplads_id
				}
			});
      return deferred.promise;
		}

	}

}]);	


