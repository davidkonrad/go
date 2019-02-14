'use strict';

/**
 *
 *
 */
angular.module('hallandparketApp')
  .controller('AdminSlidgruppeCtrl', ['$scope', '$window', '$q', 'Utils', 'AdminDataModal', 'Login', 'ESPBA', 'DTOptionsBuilder', 'DTColumnBuilder', 'DTDefaultOptions', 
	function($scope, $window, $q, Utils, AdminDataModal, Login, ESPBA, DTOptionsBuilder, DTColumnBuilder, DTDefaultOptions) {

		if (!Login.isLoggedIn()) {
			$window.location.href = '/';
		}

		$scope.dtColumns = [
      DTColumnBuilder.newColumn('id').withTitle('#id'),
      DTColumnBuilder.newColumn('navn').withTitle('Navn'),
      DTColumnBuilder.newColumn('beskrivelse')
				.withTitle('Beskrivelse')
				.withClass('td-beskrivelse')
				.renderWith(function(data) {
					return Utils.plainText(data)
				}),

			DTColumnBuilder.newColumn('meta_title')
				.withTitle('Meta title')
				.withClass('td-beskrivelse'),

      DTColumnBuilder.newColumn('meta_desc')
				.withTitle('Meta desc.')
				.withClass('td-beskrivelse')

		];

		$scope.dtOptions = DTOptionsBuilder
			.fromFnPromise(function() {
				var defer = $q.defer();
				ESPBA.get('slidgruppe', {}).then(function(res) {
					$scope.data = res.data;
					defer.resolve(res.data);
				});
				return defer.promise;
	    })
			.withOption('rowCallback', function(row, data /*, index*/) {
				$(row).attr('slidgruppe-id', data.id);
			})
			.withOption('stateSave', true)
			.withOption('dom', 'Blfrtip')
			.withOption('language', Utils.dataTables_daDk)
			.withButtons([ 
				{ 
					text: '<span><i class="glyphicon glyphicon-plus text-success"></i>&nbsp;Ny Slidgruppe</span>',
					className: 'btn btn-xs',
					action: function ( /* e, dt, node, config */) {
						AdminDataModal.show($scope, 'slidgruppe', undefined, 'admin.slidgruppe.modal.html', ['navn']).then(function() {
							$scope.dtInstance.reloadData();
						});
 					}
				}
			]);

		DTDefaultOptions.setLoadingTemplate('<img src="images/ajax-loader.gif">');

		$scope.dtInstanceCallback = function(instance) {
			$scope.dtInstance = instance;
    };

		$('#table-slidgruppe').on('click', 'tbody td', function(e) {
			var id=$(this).parent().attr('slidgruppe-id');
			if (!id) {
				e.preventDefault();
				e.stopPropagation();
				return;
			}
			AdminDataModal.show($scope, 'slidgruppe', id, 'admin.slidgruppe.modal.html', ['navn']).then(function(updated) {
				if (updated) {
					$scope.dtInstance.reloadData();
				}
			});
		});


}]);
