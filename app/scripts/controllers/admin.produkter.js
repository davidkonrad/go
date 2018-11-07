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

		$scope.dtColumns = [

      DTColumnBuilder.newColumn(null)
				.withOption('width', '20px')
				.withTitle('')
				.withClass('no-click no-padding no-export')
				.withOption('orderable', false)
				.renderWith(function(data, type, full /*, meta*/) {
					return '<button class="btn btn-primary btn-xs btn-clone" produkt-id="'+full.id+'" title="Klon dette produkt"><i class="fa fa-clone"></i></button>';
				}),

      DTColumnBuilder.newColumn('edited_timestamp')
				.withTitle('Redigeret')
				.renderWith(function(data, type) {
					if (type == 'display') {
						return moment(data).format("DD/MM/YYYY HH:mm");
					}
					return data
				}),

      DTColumnBuilder.newColumn('vare_nr').withTitle('VareNr.'),

      DTColumnBuilder.newColumn('aktiv')
				.withOption('width', '40px')
				.withTitle('Aktiv')
				.withClass('text-center no-export')
				.renderWith(function(data, type /*, full, meta*/) {
				if (type === 'display') {
					return data == 1 ? '<i class="glyphicon glyphicon-ok text-success"></i>'	: '';
				} else {
					return data;
				}
			}),

      DTColumnBuilder.newColumn('forside')
				.withOption('width', '40px')
				.withTitle('Forside')
				.withClass('text-center no-export')
				.renderWith(function(data, type /*, full, meta*/) {
				if (type === 'display') {
					return data == 1	? '<i class="glyphicon glyphicon-ok text-success"></i>'	: '';
				} else {
					return data;
				}
			}),

      DTColumnBuilder.newColumn('produkt_type_id')
				.withTitle('Type')
				.renderWith(function(data /* type. full, meta*/) {
					return Lookup.produktTypeNavn(data);
				}),

      DTColumnBuilder.newColumn('navn')
				.withTitle('Navn')
				.withClass('td-produkter-navn'),

      DTColumnBuilder.newColumn('dimension')
				.withTitle('Dimension'),

      DTColumnBuilder.newColumn('sort_id').withTitle('Træsort')
				.renderWith(function(data /*, type, full, meta*/) {
					return Lookup.sortNavn(data);
				}),

      DTColumnBuilder.newColumn('kategori_id').withTitle('Kategori')
				.renderWith(function(data /*, type, full, meta*/) {
					return Lookup.kategoriNavn(data);
				}),

      DTColumnBuilder.newColumn('kvalitet_id').withTitle('Kvalitet')
				.renderWith(function(data /*, type, full, meta*/) {
					return Lookup.kvalitetNavn(data);
				}),

      DTColumnBuilder.newColumn('overflade_id').withTitle('Overflade')
				.renderWith(function(data /*, type, full, meta*/) {
					return Lookup.overfladeNavn(data);
				}),

      DTColumnBuilder.newColumn('slidgruppe_id').withTitle('Slidgruppe')
				.renderWith(function(data /*, type, full, meta*/) {
					return Lookup.slidgruppeNavn(data);
				}),

      DTColumnBuilder.newColumn('enhed_id')
				.withTitle('Enhed')
				.renderWith(function(data /*, type, full, meta*/) {
					return Lookup.enhedNavn(data);
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

      DTColumnBuilder.newColumn('lagerplads')
				.withTitle('Lagerplads'),

      DTColumnBuilder.newColumn('nyhed')
				.withOption('width', '40px')
				.withTitle('Nyhed')
				.withClass('text-center no-export')
				.renderWith(function(data, type /*, full, meta*/) {
					if (type === 'display') {
						return data == 1	? '<i class="glyphicon glyphicon-ok text-success"></i>'	: '';
					} else {
						return data;
					}
				}),

			DTColumnBuilder.newColumn('meta_title')
				.withTitle('Meta title')
				.withClass('td-beskrivelse no-export'),

      DTColumnBuilder.newColumn('meta_desc')
				.withTitle('Meta desc.')
				.withClass('td-beskrivelse no-export'),

      DTColumnBuilder.newColumn(null)
				.withOption('width', '20px')
				.withTitle('')
				.withClass('no-click no-export')
				.renderWith(function(data, type, full /*, meta*/) {
					return '<a href="' + Utils.getProduktLink(full) +'"><i class="glyphicon glyphicon-share-alt text-primary"></i></a>';
				})
		];

		$scope.dtOptions = DTOptionsBuilder
			.fromFnPromise(function() {
				var defer = $q.defer();
				Lookup.__init().then(function() {
					ESPBA.get('produkter', {}).then(function(res) {
						$scope.data = res.data;
						defer.resolve($scope.data);
					})
				})
				return defer.promise;
	    })
			.withOption('drawCallback', function() {
			})
			.withOption('rowCallback', function(row, data /*, index*/) {
				$(row).attr('produkt-id', data.id);

				var err = '';
				if (data.navn == '') err+='Produktet har ikke noget <strong>Navn</strong>. ';
				if (data.kategori_id <= 0) err+='Produktet ikke knyttet til en <strong>Kategori</strong>. ';
				if (data.vare_nr == '') err+='Der mangler <strong>VareNr</strong>. ';
				if (data.pris_enhed <= 0) err+='Der mangler <strong>Pris</strong>. ';
				if (data.dimension == '') err+='Der mangler <strong>Dimension</strong>. ';
				
				if (err != '') {
					$(row).addClass('warning');
					$(row).tooltip({
						title: err,
						trigger: 'hover',
						container: 'html',
						XXplacement: 'left',
						html: true
					});

/*
					$(row).addClass('warning');
					$(row).attr('data-original-title', err);
					$(row).attr('data-container', 'body');
					$(row).attr('data-html', 'true');
					$(row).attr('data-placement', 'top');
					$(row).attr('data-toggle', 'tooltip');
					$(row).tooltip()
*/

				}
			})
			.withOption('dom', 'Blfrtip')
			.withOption('stateSave', true)
			.withOption('language', Utils.dataTables_daDk)
			.withButtons([ 
				{ extend : 'colvis',
					text: 'Vis kolonner &nbsp;<i class="caret" style="position:relative;top:-3px;"></i>',
					className: 'btn btn-default btn-xs colvis-btn'
				},
				{ extend : 'excelHtml5',
					text: '<span title="Download filtrerede produkter som Excel-regneark"><i class="glyphicon glyphicon-download-alt"></i>&nbsp;Excel</span>',
					filename: 'gulveonline_'+Utils.todayStr(),
					className: 'btn btn-default btn-xs',
					exportOptions: {
						columns: "#table-produkter thead th:not(.no-export)"
					}
				},
				{ extend : 'pdfHtml5',
					text: '<span title="Download filtrerede produkter som PDF-regneark"><i class="glyphicon glyphicon-download-alt"></i>&nbsp;PDF</span>',
					filename: 'gulveonline_'+Utils.todayStr(),
					className: 'btn btn-default btn-xs',
					exportOptions: {
						columns: "#table-produkter thead th:not(.no-export)"
					}
				},
				{ text: '<span><i class="glyphicon glyphicon-plus text-success"></i>&nbsp;Nyt Produkt</span>',
					className: 'btn btn-xs',
					action: function ( /* e, dt, node, config */) {
						ProduktModal.show().then(function() {
							$scope.dtInstance.reloadData();
						});
 					}
				}

			]);

		DTDefaultOptions.setLoadingTemplate('<img src="images/ajax-loader.gif">');

		$scope.dtInstanceCallback = function(instance) {
			$scope.dtInstance = instance;
    };

		angular.element('#table-produkter').on('click', 'tbody td:not(.no-click)', function(e) {
			var id=$(this).parent().attr('produkt-id');
			ProduktModal.show(id).then(function() {
				$scope.dtInstance.reloadData();
			});	
		});

		angular.element('#table-produkter').on('click', 'tbody button.btn-clone', function(e) {
			var id=$(this).attr('produkt-id');
			if (confirm('Kopier produkt?')) {
				ESPBA.get('produkter', { id: id }).then(function(p) {
					var data = p.data[0];
					delete data.id;
					if (data.vare_nr != '') {
						data.vare_nr+=' (kopi)';
					} else {
						data.vare_nr = id+' (kopi)';
					}
					if (data.navn != '') {
						data.navn+=' (kopi)';
					} else {
						data.navn = 'produkt #'+id+' (kopi)';
					}

					ESPBA.insert('produkter', data).then(function(p) {
						$scope.dtInstance.reloadData();
						id = p.data[0].id;
						ProduktModal.show($scope, id).then(function() {
							$scope.dtInstance.reloadData();
						});
					});
				});
			}
		});


}]);
