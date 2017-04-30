'use strict';

/**
 *
 *
 */
angular.module('gulveonlineApp')
  .controller('AdminTilbudCtrl', ['$scope', '$window', '$q', 'Lookup', 'AdminDataModal', 'Login', 'Utils', 'ESPBA', 'DTOptionsBuilder', 'DTColumnBuilder', 'DTDefaultOptions', 
	function($scope, $window, $q, Lookup, AdminDataModal, Login, Utils, ESPBA, DTOptionsBuilder, DTColumnBuilder, DTDefaultOptions) {

		if (!Login.isLoggedIn()) {
			$window.location.href = '/';
		}

		$scope.ex = {};

		//typeahead and lookup
		var formatProdukt = function(item) {
			return item.navn +' ['+ (item.vare_nr !== '' ? item.vare_nr : '?') + ']';
		};
		var getProdukt = function(id) {
			for (var i=0, l=$scope.produkter.length; i<l; i++) {
				if ($scope.produkter[i].id == id) {
					return formatProdukt($scope.produkter[i]);
				}
			}
			return '?';
		};	

		$scope.displayText = function(item) {
			return formatProdukt(item);
		};

		$scope.afterSelect = function(item) {
			$scope.ex.enhed_navn = Lookup.enhedNavn(item.enhed_id);
			$scope.ex.old_price = item.pris_enhed;
			$scope.edit.produkt_id = item.id;
			$scope.$apply();
			$('#produkt').val(getProdukt(item.id));
		};

		$scope.getOldPrice = function(id) {
			for (var i=0, l=$scope.produkter.length; i<l; i++) {
				if ($scope.produkter[i].id === id) {
					return $scope.produkter[i].pris_enhed;
				}
			}
			return '?';
		};	

		$scope.dtColumns = [
      DTColumnBuilder.newColumn('id').withTitle('#id'),

      DTColumnBuilder.newColumn('produkt_id')
				.withTitle('Produkt')
				.renderWith(function(data) {
					return getProdukt(parseFloat(data));
				}),

      DTColumnBuilder.newColumn('').withTitle('Førpris')
				.renderWith(function(data, type, full) {
					return $scope.getOldPrice(full.produkt_id);
				}),
		
      DTColumnBuilder.newColumn('tilbud_pris_enhed').withTitle('Tilbud'),
      DTColumnBuilder.newColumn('fra_dato').withTitle('Fra'),
      DTColumnBuilder.newColumn('til_dato').withTitle('Til'),
      DTColumnBuilder.newColumn('').withTitle('')
				.withClass('tilbud-remove')
				.renderWith(function( /*data, type, full*/) {
					return '<button class="btn btn-danger"><i class=" fa fa-times"></i>&nbsp;Fjern</button>';
				})
		];

		$scope.dtOptions = DTOptionsBuilder
			.fromFnPromise(function() {
				var defer = $q.defer();
				ESPBA.get('produkter', { aktiv: 1 }).then(function(p) {
					$scope.produkter = p.data;
					ESPBA.get('tilbud', {}).then(function(t) {
						$scope.data = t.data;
						defer.resolve(t.data);
					});
				});
				return defer.promise;
	    })
			.withOption('stateSave', true)
			.withOption('rowCallback', function(row, data /*, index*/) {
				$(row).attr('tilbud-id', data.id);
				$(row).attr('produkt-id', data.produkt_id);
			})
			.withOption('dom', 'Blfrtip')
			.withOption('language', Utils.dataTables_daDk)
			.withButtons([ 
				{ 
					text: '<span><i class="glyphicon glyphicon-plus text-success"></i>&nbsp;Nyt Tilbud</span>',
					className: 'btn btn-xs',
					action: function ( /* e, dt, node, config */) {
						AdminDataModal.show($scope, 'tilbud', undefined, 'admin.tilbud.modal.html', ['produkt_id', 'tilbud_pris_enhed']).then(function() {
							$scope.dtInstance.reloadData();
							//mark produkt as Tilbud
							var update = { id: $scope.edit.produkt_id, produkt_type_id: 2 };
							if ($scope.ex.forside) {
								update.forside = 1;
							}
							ESPBA.update('produkter', update).then(function() {
							});
						});
 					}
				}
			]);

		DTDefaultOptions.setLoadingTemplate('<img src="images/ajax-loader.gif">');

		$scope.dtInstanceCallback = function(instance) {
			$scope.dtInstance = instance;
    };

		$(document).on('click', '#table-tilbud tbody .tilbud-remove', function() {
			var id=$(this).closest('tr').attr('tilbud-id');
			var produkt_id=$(this).closest('tr').attr('produkt-id');
			if (window.confirm('Fjern tilbud?')) {
				ESPBA.delete('tilbud', { id: id }).then(function() {
					$scope.dtInstance.reloadData();
				});
				//set produkt_type to ordinary produkt
				ESPBA.update('produkter', { id: produkt_id, produkt_type_id: 1 }).then(function() {
				});
			}
		});

		$(document).on('click', '#table-tilbud tbody td:not(.tilbud-remove)', function(e) {
			var id=$(this).closest('tr').attr('tilbud-id');
			if (!id) {
				e.preventDefault();
				e.stopPropagation();
				return;
			}
			AdminDataModal.show($scope, 'tilbud', id, 'admin.tilbud.modal.html', ['produkt_id', 'tilbud_pris_enhed']).then(function(updated) {
				if (updated) {
					$scope.dtInstance.reloadData();
					//mark produkt as Tilbud
					var update = { id: $scope.edit.produkt_id, produkt_type_id: 2 };
					if ($scope.ex.forside) {
						update.forside = 1;
					}
					ESPBA.update('produkter', update).then(function() {
					});
				}
			});		
		});


}]);
