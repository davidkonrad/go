'use strict';

/**
 *
 *
 */
angular.module('gulveonlineApp')
  .controller('AdminEnhedCtrl', ['$scope', '$window', '$q', 'AdminDataModal', 'Login', 'Utils', 'ESPBA', 'DTOptionsBuilder', 'DTColumnBuilder', 'DTDefaultOptions', 
	function($scope, $window, $q, AdminDataModal, Login, Utils, ESPBA, DTOptionsBuilder, DTColumnBuilder, DTDefaultOptions) {

		if (!Login.isLoggedIn()) {
			$window.location.href = '/';
		}

		$scope.dtColumns = [
      DTColumnBuilder.newColumn('id').withTitle('#id'),
      DTColumnBuilder.newColumn('ental').withTitle('Ental'),
      DTColumnBuilder.newColumn('flertal').withTitle('Flertal'),
      DTColumnBuilder.newColumn('beskrivelse').withTitle('Beskrivelse')
		];

		$scope.dtOptions = DTOptionsBuilder
			.fromFnPromise(function() {
				var defer = $q.defer();
				ESPBA.get('enhed', {}).then(function(res) {
					$scope.data = res.data;
					defer.resolve(res.data)
				})
				return defer.promise;
	    })
			.withOption('rowCallback', function(row, data, index) {
				$(row).attr('enhed-id', data.id);
			})
			.withOption('stateSave', true)
			.withOption('dom', 'Blfrtip')
			.withOption('language', Utils.dataTables_daDk)
			.withButtons([ 
				{ 
					text: '<span><i class="glyphicon glyphicon-plus text-success"></i>&nbsp;Ny Enhed</span>',
					className: 'btn btn-xs',
					action: function ( e, dt, node, config ) {
						AdminDataModal.show($scope, 'enhed', undefined, 'admin.enhed.modal.html', ['ental', 'flertal']).then(function(updated) {
							$scope.dtInstance.reloadData();
						})					
 					}
				}
			]);

		DTDefaultOptions.setLoadingTemplate('<img src="images/ajax-loader.gif">')

		$scope.dtInstanceCallback = function(instance) {
			$scope.dtInstance = instance;
    };

		$(document).on('click', '#table-enhed tbody td:not(.no-click)', function(e) {
			var id=$(this).parent().attr('enhed-id');
			if (!id) {
				e.preventDefault();
				e.stopPropagation();
				return
			}
			AdminDataModal.show($scope, 'enhed', id, 'admin.enhed.modal.html', ['ental', 'flertal']).then(function(updated) {
				if (updated) $scope.dtInstance.reloadData();
			})					
		});


}]);
