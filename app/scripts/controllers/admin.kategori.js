'use strict';

/**
 *
 *
 */
angular.module('hallandparketApp')
  .controller('AdminKategoriCtrl', ['$scope', '$window', '$q', 'AdminDataModal', 'Login', 'Utils', 'ESPBA', 'DTOptionsBuilder', 'DTColumnBuilder', 'DTDefaultOptions', 
	function($scope, $window, $q, AdminDataModal, Login, Utils, ESPBA, DTOptionsBuilder, DTColumnBuilder, DTDefaultOptions) {

		if (!Login.isLoggedIn()) {
			$window.location.href = '/';
		}

		$scope.dtColumns = [
      DTColumnBuilder.newColumn('id').withTitle('#id'),

      DTColumnBuilder.newColumn('aktiv')
				.withOption('width', '40px')
				.withTitle('Aktiv')
				.withClass('text-center no-click')
				.renderWith(function(data, type /*, full, meta*/) {
				if (type === 'display') {
					return data == 1 ? '<i class="glyphicon glyphicon-ok text-success"></i>' : '';
				} else {
					return data;
				}
			}),

      DTColumnBuilder.newColumn('navn').withTitle('Navn'),

      DTColumnBuilder.newColumn('beskrivelse')
				.withTitle('Beskrivelse')
				.withClass('td-beskrivelse')
				.renderWith(function(data /* type, full, meta*/) {
					return Utils.plainText(data);
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
				ESPBA.get('kategori', {}).then(function(res) {
					$scope.data = res.data;
					defer.resolve(res.data);
				});
				return defer.promise;
	    })
			.withOption('rowCallback', function(row, data /*, index*/) {
				$(row).attr('kategori-id', data.id);
			})
			.withOption('stateSave', true)
			.withOption('dom', 'Blfrtip')
			.withOption('language', Utils.dataTables_daDk)
			.withButtons([ 
				{ 
					text: '<span><i class="glyphicon glyphicon-plus text-success"></i>&nbsp;Ny Kategori</span>',
					className: 'btn btn-xs',
					action: function ( /* e, dt, node, config */ ) {
						AdminDataModal.show($scope, 'kategori', undefined, 'admin.kategori.modal.html', ['navn']).then(function() {
							$scope.dtInstance.reloadData();
						});
 					}
				}
			]);

		DTDefaultOptions.setLoadingTemplate('<img src="images/ajax-loader.gif">');

		$scope.dtInstanceCallback = function(instance) {
			$scope.dtInstance = instance;
    };

		$('#table-kategori').on('click', 'tbody td:not(.no-click)', function(e) {
			var id=$(this).parent().attr('kategori-id');
			e.preventDefault();
			e.stopPropagation();
			if (!id) {
				return;
			}
			AdminDataModal.show($scope, 'kategori', id, 'admin.kategori.modal.html', ['navn']).then(function(updated) {
				if (updated) {
					$scope.dtInstance.reloadData();
				}
			});				
		});


}]);
