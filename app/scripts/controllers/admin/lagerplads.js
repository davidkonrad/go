'use strict';

/**
 *
 *
 */
angular.module('hallandparketApp')
  .controller('AdminLagerpladsCtrl', ['$scope', '$window', '$q', 'Utils', 'AdminDataModal', 'Login', 'ESPBA', 'DTOptionsBuilder', 'DTColumnBuilder', 'DTDefaultOptions', 
	function($scope, $window, $q, Utils, AdminDataModal, Login, ESPBA, DTOptionsBuilder, DTColumnBuilder, DTDefaultOptions) {

		if (!Login.isLoggedIn()) {
			$window.location.href = '/';
		}

		$scope.dtColumns = [
      DTColumnBuilder.newColumn('id').withTitle('#id'),
      DTColumnBuilder.newColumn('parent_id').withTitle('Tilhører').renderWith(function(data) {
				return (data>0) ? $scope.lookup[data] : ''
			}),
      DTColumnBuilder.newColumn('navn').withTitle('Sted (navn)'),
      DTColumnBuilder.newColumn('note').withTitle('Noter')
		];

		$scope.dtOptions = DTOptionsBuilder
			.fromFnPromise(function() {
				var defer = $q.defer();
				ESPBA.get('lagerplads', {}).then(function(res) {
					$scope.lookup = [];
					$scope.data = res.data.map(function(d) {
						if (d.parent_id <= 0) d.parent_id = null;
						$scope.lookup[d.id] = d.navn;
						return d
					})
					defer.resolve($scope.data);
				});
				return defer.promise;
	    })
			.withOption('rowCallback', function(row, data , index) {
				$(row).attr('lagerplads-id', data.id) 
			})
			.withOption('stateSave', true)
			.withOption('dom', 'Blfrtip')
			.withOption('language', Utils.dataTables_daDk)
			.withButtons([ 
				{ 
					text: '<span><i class="glyphicon glyphicon-plus text-success"></i>&nbsp;Ny Lagerplads</span>',
					className: 'btn btn-xs',
					action: function ( e, dt, node, config ) {
						$scope.parents = $scope.data;
						AdminDataModal.show($scope, 'lagerplads', undefined, 'admin/lagerplads.modal.html', ['navn']).then(function() {
							$scope.dtInstance.reloadData();
						});
 					}
				}
			]);

		$scope.dtInstanceCallback = function(instance) {
			$scope.dtInstance = instance;
    };

		$('#table-lagerplads').on('click', 'tbody td', function(e) {
			var id=$(this).parent().attr('lagerplads-id');
			$scope.parents = $scope.data.filter(function(d) {
				if (d.id != id) return d
			})
			$scope.parents.unshift({ sted: '<b>Nulstill</b>', id: undefined });
			AdminDataModal.show($scope, 'lagerplads', id, 'admin/lagerplads.modal.html', ['navn']).then(function(updated) {
				if (updated) {
					$scope.dtInstance.reloadData();
				}
			});
		});


}]);
