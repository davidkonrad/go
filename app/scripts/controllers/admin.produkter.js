'use strict';

/**
 * 
 * 
 */
angular.module('gulveonlineApp')
  .controller('AdminProdukterCtrl', ['$scope', '$window', '$q', '$timeout', 'Lookup', 'Login', 'Utils', 'ProduktModal', 'ESPBA', 'DTOptionsBuilder', 'DTColumnBuilder', 'DTDefaultOptions', 
	function($scope, $window, $q, $timeout, Lookup, Login, Utils, ProduktModal, ESPBA, DTOptionsBuilder, DTColumnBuilder, DTDefaultOptions) {

		if (!Login.isLoggedIn()) {
			$window.location.href = '/';
		}

		$scope.kategorier = [];
		$scope.idToKategori = function(kategori_id) {
			for (var i=0, l=$scope.kategorier.length; i<l; i++) {
				if ($scope.kategorier[i].id == kategori_id) return $scope.kategorier[i].navn
			}
			return ''
		}

		ESPBA.get('kategori', {}).then(function(r) {
			r.data.sort(function(a, b) {
				return a.navn.localeCompare(b.navn)
			});
			$scope.kategorier = r.data;
		});

		$scope.dtColumns = [
      DTColumnBuilder.newColumn('vare_nr').withTitle('VareNr.'),

      DTColumnBuilder.newColumn('produkt_type_id')
				.withTitle('Type')
				.renderWith(function(data, type, full, meta) {
					return Lookup.produktTypeNavn(data)
				}),

      DTColumnBuilder.newColumn('navn')
				.withTitle('Navn')
				.withClass('td-produkter-navn'),

      DTColumnBuilder.newColumn('dimension')
				.withTitle('Dimension'),

      DTColumnBuilder.newColumn('sort_id').withTitle('Træsort')
				.renderWith(function(data, type, full, meta) {
					return Lookup.sortNavn(data)
				}),

      DTColumnBuilder.newColumn('kategori_id').withTitle('Kategori')
				.renderWith(function(data, type, full, meta) {
					return Lookup.kategoriNavn(data)
				}),

      DTColumnBuilder.newColumn('kvalitet_id').withTitle('Kvalitet')
				.renderWith(function(data, type, full, meta) {
					return Lookup.kvalitetNavn(data)
				}),

      DTColumnBuilder.newColumn('overflade_id').withTitle('Overflade')
				.renderWith(function(data, type, full, meta) {
					return Lookup.overfladeNavn(data)
				}),

      DTColumnBuilder.newColumn('enhed_id')
				.withTitle('Enhed')
				.renderWith(function(data, type, full, meta) {
					return Lookup.enhedNavn(data)
				}),

      DTColumnBuilder.newColumn('paa_lager')
				.withTitle('Lager')
				.withClass('text-right'),

      DTColumnBuilder.newColumn('pris_enhed')
				.withTitle('Pris/enhed')
				.withClass('text-right'),

      DTColumnBuilder.newColumn('pakker')
				.withTitle('Pakker')
				.withClass('text-right'),

      DTColumnBuilder.newColumn('pakke_str')
				.withTitle('Pk.str.')
				.withClass('text-right'),

      DTColumnBuilder.newColumn('aktiv')
				.withOption('width', '40px')
				.withTitle('Aktiv')
				.withClass('no-click text-center')
				.renderWith(function(data, type, full, meta) {
				if (type == 'display') {
					return data == 1
						? '<i class="glyphicon glyphicon-ok text-success"></i>'
						: '';
				} else {
					return data
				}
			}),

      DTColumnBuilder.newColumn('forside')
				.withOption('width', '40px')
				.withTitle('Forside')
				.withClass('text-center')
				.renderWith(function(data, type, full, meta) {
				if (type == 'display') {
					return data == 1
						? '<i class="glyphicon glyphicon-ok text-success"></i>'
						: '';
				} else {
					return data
				}
			}),

      DTColumnBuilder.newColumn('nyhed')
				.withOption('width', '40px')
				.withTitle('Nyhed')
				.withClass('text-center')
				.renderWith(function(data, type, full, meta) {
				if (type == 'display') {
					return data == 1
						? '<i class="glyphicon glyphicon-ok text-success"></i>'
						: '';
				} else {
					return data
				}
			}),

      DTColumnBuilder.newColumn(null)
				.withOption('width', '20px')
				.withTitle('')
				.withClass('no-click')
				.renderWith(function(data, type, full, meta) {
						return '<a href="#/produkt/'+full.navn+'/'+full.id+'"><i class="glyphicon glyphicon-share-alt text-primary"></i></a>'
				})
		];

		$scope.dtOptions = DTOptionsBuilder
			.fromFnPromise(function() {
				var defer = $q.defer();
				ESPBA.get('produkter', {}).then(function(res) {
					$scope.data = res.data;
					defer.resolve(res.data)
				})
				return defer.promise;
	    })
			.withOption('drawCallback', function() {
			})
			.withOption('rowCallback', function(row, data, index) {
				$(row).attr('produkt-id', data.id);
			})
			.withOption('dom', 'Blfrtip')
			.withOption('stateSave', true)
			.withOption('language', Utils.dataTables_daDk)
			.withButtons([ 
				{ extend : 'colvis',
					text: 'Vis kolonner &nbsp;<i class="fa fa-sort-down" style="position:relative;top:-3px;"></i>',
					className: 'btn btn-default btn-xs colvis-btn'
				},
				{ extend : 'excelHtml5',
					text: '<span title="Download filtrerede produkter som Excel-regneark"><i class="fa fa-download"></i>&nbsp;Excel</span>',
					filename: 'gulveonline_'+Utils.todayStr(),
					className: 'btn btn-default btn-xs'
				},
				{ extend : 'pdfHtml5',
					text: '<span title="Download filtrerede produkter som PDF-regneark"><i class="fa fa-download"></i>&nbsp;PDF</span>',
					filename: 'gulveonline_'+Utils.todayStr(),
					className: 'btn btn-default btn-xs'
				},
				{ text: '<span><i class="glyphicon glyphicon-plus text-success"></i>&nbsp;Nyt Produkt</span>',
					className: 'btn btn-xs',
					action: function ( e, dt, node, config ) {
						ProduktModal.show($scope).then(function(updated) {
							$scope.dtInstance.reloadData();
						})					
 					}
				}

			]);

		DTDefaultOptions.setLoadingTemplate('<img src="images/ajax-loader.gif">')

		$scope.dtInstanceCallback = function(instance) {
			$scope.dtInstance = instance;
    };

		angular.element('#table-produkter').on('click', 'tbody td:not(.no-click)', function(e) {
			var id=$(this).parent().attr('produkt-id');

			//should never happen with new delegated event structure
			if (!id || ProduktModal.isShown()) {
				e.preventDefault();
				e.stopPropagation();
				return
			}

			ProduktModal.show($scope, id).then(function(updated) {
				$scope.dtInstance.reloadData();
			})					
		});



}]);
