'use strict';

/**
 *
 *
 */
angular.module('gulveonlineApp')
  .controller('AdminTilbudCtrl', ['$scope', '$window', '$q', 'AdminDataModal', 'Login', 'Utils', 'ESPBA', 'DTOptionsBuilder', 'DTColumnBuilder', 'DTDefaultOptions', 
	function($scope, $window, $q, AdminDataModal, Login, Utils, ESPBA, DTOptionsBuilder, DTColumnBuilder, DTDefaultOptions) {

		if (!Login.isLoggedIn()) {
			$window.location.href = '/';
		}

		$scope.dtColumns = [
      DTColumnBuilder.newColumn('id').withTitle('#id'),
      DTColumnBuilder.newColumn('produkt_id').withTitle('Produkt'),
      DTColumnBuilder.newColumn('tilbud_pris_enhed').withTitle('Tilb.Pris'),
      DTColumnBuilder.newColumn('fra_dato').withTitle('Fra'),
      DTColumnBuilder.newColumn('til_dato').withTitle('Til')
		];

		$scope.dtOptions = DTOptionsBuilder
			.fromFnPromise(function() {
				var defer = $q.defer();
				ESPBA.get('tilbud', {}).then(function(res) {
					$scope.data = res.data;
					defer.resolve(res.data)
				})
				return defer.promise;
	    })
			.withOption('stateSave', true)
			.withOption('rowCallback', function(row, data, index) {
				$(row).attr('tilbud-id', data.id);
			})
			.withOption('dom', 'Blfrtip')
			.withOption('language', Utils.dataTables_daDk)
			.withButtons([ 
				{ 
					text: '<span><i class="glyphicon glyphicon-plus text-success"></i>&nbsp;Nyt Tilbud</span>',
					className: 'btn btn-xs',
					action: function ( e, dt, node, config ) {
						AdminDataModal.show($scope, 'kvalitet', undefined, 'admin.tilbud.modal.html', ['produkt_id', 'tilbud_pris_enhed']).then(function(updated) {
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
			var id=$(this).parent().attr('tilbud-id');
			if (!id) {
				e.preventDefault();
				e.stopPropagation();
				return
			}
			AdminDataModal.show($scope, 'tilbud', id, 'admin.tilbud.modal.html', ['produkt_id', 'tilbud_pris_enhed']).then(function(updated) {
				if (updated) $scope.dtInstance.reloadData();
			})					
		});


}]);
