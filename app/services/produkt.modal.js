'use strict';

/**
 *
 *
 */
angular.module('hallandparketApp').factory('ProduktModal', ['$modal', '$q',	function($modal, $q) {

	var modal;
	var deferred;
	var local = this;

	local.modalInstance = ['$scope', 'ESPBA', 'Utils', 'UploadModal', 'InputModal', 'Lookup', 'ProduktEkstraModal', 'DTOptionsBuilder', 'DTColumnBuilder', 'LagerpladsModal', 'produkt_id', 
	function($scope, ESPBA, Utils, UploadModal, InputModal, Lookup, ProduktEkstraModal, DTOptionsBuilder, DTColumnBuilder, LagerpladsModal, produkt_id) {

		$scope.produkt_id = produkt_id || false;

		$scope.__produktModal = {
			title: produkt_id ? 'Rediger produkt' : 'Opret nyt Produkt',
			btnOk: produkt_id ? 'Gem og luk' : 'Opret produkt og luk'
		};
		
		$scope.edit = {};
		if (produkt_id) {
			ESPBA.get('produkter', { id: produkt_id }).then(function(r) {
				$scope.edit = r.data[0];
				$scope.current_lagerplads = Lookup.lagerpladsNavnFull($scope.edit.lagerplads_id);
				$scope.reloadImages();
				$scope.__produktModal.title = 'Rediger <strong>'+$scope.edit.vare_nr+'</strong>'

				//set flag so pakke_log can be updated
				$scope.$watch('edit.pakker', function(newVal, oldVal) {
					if (newVal && newVal != oldVal) {
						$scope.PAKKER_UPDATE = true
					}
				});
			})
		};

		$scope.$watch('edit.enhed_id', function() {
			$scope.enhedFlertal = Lookup.enhedNavnFlertal($scope.edit.enhed_id);
			$scope.enhedEntal = Lookup.enhedNavn($scope.edit.enhed_id);
		});

		$scope.$watchGroup(['edit.pakker', 'edit.pakke_str'], function(newVal, oldVal) {
			if (newVal == oldVal) return;
			if ($scope.edit.pakke_str) {
				var paa_lager = parseFloat($scope.edit.pakke_str) * parseFloat(newVal);
				$scope.edit.paa_lager = Math.round(paa_lager * 100) / 100;
			}
		});

		$scope.canSave = function() {
			return $scope.edit.pris_enhed != undefined &&
				$scope.edit.enhed_id != undefined &&
				$scope.edit.navn != undefined &&
				$scope.edit.kategori_id != undefined
		};

		$scope.$watch('edit.nyhed', function(newVal, oldVal) {
			//if produkt is marked as nyhed, set produkt_type as produkt
			if (newVal == true) $scope.edit.produkt_type_id = '1';
		});

		$scope.sortItems = [{ id: 0, navn: '--'}].concat(Lookup.sortItems());
		$scope.kategoriItems = Lookup.kategoriItems();
		$scope.enhedItems = Lookup.enhedItems();
		$scope.kvalitetItems = [{ id: 0, navn: '--'}].concat(Lookup.kvalitetItems());
		$scope.overfladeItems = [{ id: 0, navn: '--'}].concat(Lookup.overfladeItems());
		$scope.produktTypeItems = [{ id: 0, navn: '--'}].concat(Lookup.produktTypeItems());
		$scope.profilItems = [{ id: 0, navn: '--'}].concat(Lookup.profilItems());
		$scope.slidgruppeItems = [{ id: 0, navn: '--'}].concat(Lookup.slidgruppeItems());

		$scope.changeLagerplads = function() {
			LagerpladsModal.show($scope.edit.lagerplads_id).then(function(l) {
				if (l) {
					$scope.edit.lagerplads_id = l;
					$scope.current_lagerplads = Lookup.lagerpladsNavnFull(l);
				}
			})
		}

		$scope.reloadImages = function() {
			$scope.billeder = [];
			if (!$scope.edit.id) {
				$scope.$apply();
				return
			}
			ESPBA.get('billeder', { produkt_id: $scope.edit.id }).then(function(r) {
				$scope.billeder = r.data;
			})
		};

		$scope.addImage = function() {
			UploadModal.show($scope).then(function(r) {	
				if (r) {
					var data = {
						path: r.filename,
						produkt_id: $scope.edit.id
					};
					ESPBA.insert('billeder', data).then(function(r) {
						$scope.reloadImages();
					})
				}
			})
		};
				
		$scope.removeImage = function(image) {
			if (confirm('Er du sikker på du vil slette billedet?')) {
				ESPBA.delete('billeder', { id: image.id }).then(function(r) {
					UploadModal.delete(image.path).then(function(r) {
					});
					$scope.reloadImages();
				})
			}
		};			

		var _modalClose = function(value) {
			modal.hide();
			modal.destroy();
			modal = null;
      deferred.resolve(value)
		}

		$scope.produktModalClose = function(value) {
			if (value) {
				if (produkt_id) {
					$scope.edit.edited_timestamp = 'CURRENT_TIMESTAMP';
					ESPBA.update('produkter', $scope.edit).then(function(r) {
						if ($scope.PAKKER_UPDATE) {
							delete $scope.PAKKER_UPDATE
							var obj = {
								produkt_id: $scope.edit.id, 
								action: '=', 
								antal: $scope.edit.pakker,
								total: $scope.edit.pakker
							}
							ESPBA.insert('pakke_log', obj )
						}
						_modalClose(true)
					})
				} else {
					ESPBA.insert('produkter', $scope.edit).then(function(r) {
						_modalClose(true)
					})
				}
			} else {
				_modalClose()
			}
		};

//lager opdatering
		$scope.lagerAdd = function() {
			var p = {
				title: 'Tilføj til lager',
				placeholder: "0.0",
				desc: 'Skriv antal pakker der skal <strong>tilføjes</strong> lagerbeholdning',
				type: 'float'
			}
			InputModal.show(p).then(function(val) {
				if (val) {
					var pakker = parseFloat($scope.edit.pakker) + parseFloat(val);
					var paa_lager = parseFloat($scope.edit.pakke_str) * pakker;
					paa_lager = Math.round(paa_lager * 100) / 100;
					var update = {
						id: $scope.edit.id,
						edited_timestamp: 'CURRENT_TIMESTAMP',
						pakker: pakker,
						paa_lager: paa_lager
					}
					ESPBA.update('produkter', update).then(function(r) {
						ESPBA.insert('pakke_log', { produkt_id: $scope.edit.id, action: '+', antal: val, total: pakker })
						_modalClose(true)
					})
				}
			})
		}

		$scope.lagerRemove = function() {
			var p = {
				value: "",
				title: 'Fjern fra lager',
				placeholder: '0.0',
				desc: 'Skriv antal pakker der skal <strong>fjernes</strong> lagerbeholdning',
				type: 'float'
			}
			InputModal.show(p).then(function(val) {
				if (val) {
					var pakker = parseFloat($scope.edit.pakker) - parseFloat(val);
					var paa_lager = parseFloat($scope.edit.pakke_str) * pakker;
					paa_lager = Math.round(paa_lager * 100) / 100;
					var update = {
						id: $scope.edit.id,
						edited_timestamp: 'CURRENT_TIMESTAMP',
						pakker: pakker,
						paa_lager: paa_lager
					}
					ESPBA.update('produkter', update).then(function(r) {
						ESPBA.insert('pakke_log', { produkt_id: $scope.edit.id, action: '-', antal: val, total: pakker })
						_modalClose(true)
					})
				}
			})
		}

//---------------------
//produkt ekstra
		$scope.dtEkstraColumns = [
      DTColumnBuilder.newColumn('id').withTitle('#').withOption('orderable', false),
      DTColumnBuilder.newColumn('key').withTitle('Egenskab'),
			DTColumnBuilder.newColumn('value').withTitle('Værdi'),
      DTColumnBuilder.newColumn('sort_order').withTitle('Sortering'),
      DTColumnBuilder.newColumn('id').withTitle('').withClass('no-click').renderWith(function(data) {
				return '<button class="btn btn-xs btn-danger produkt-ekstra-delete" produkt-ekstra-id="'+data+'" title="Slet ekstra egenskab"><i class="fa fa-times"></button>'
			})
		];

		$scope.dtEkstraOptions = DTOptionsBuilder
			.fromFnPromise(function() {
				var defer = $q.defer();
				ESPBA.get('produkt_ekstra', { produkt_id: produkt_id }).then(function(res) {
					$scope.data = res.data;
					defer.resolve($scope.data);
				});
				return defer.promise;
	    })
			.withOption('rowCallback', function(row, data , index) {
				$(row).attr('produkt-ekstra-id', data.id);
			})
			.withOption('dom', 'Bfrtip') 
			.withOption('lengthChange', false)
			.withOption('pageLength', 7)
			.withOption('stateSave', false)
			.withOption('language', Utils.dataTables_daDk)
			.withButtons([ 
				{ text: '<span><i class="glyphicon glyphicon-plus text-success"></i>&nbsp;Ny ekstra egenskab</span>',
					className: 'btn btn-xs',
					action: function( /* e, dt, node, config */) {
						ProduktEkstraModal.show(produkt_id).then(function() {
							$scope.dtEkstraInstance.reloadData();
						});
 					}
				}

			]);

		$scope.dtEkstraInstanceCallback = function(instance) {
			$scope.dtEkstraInstance = instance;
    };

		angular.element('body').on('click', '#table-ekstra tbody td:not(.no-click)', function(e) {
			var produkt_ekstra_id = $(this).parent().attr('produkt-ekstra-id');
			ProduktEkstraModal.show(produkt_id, produkt_ekstra_id).then(function() {
				$scope.dtEkstraInstance.reloadData();
			});	
		});

		angular.element('body').on('click', '#table-ekstra tbody .produkt-ekstra-delete', function(e) {
			var peid = $(this).attr('produkt-ekstra-id');
			var ok = confirm('Slet ekstra egenskab?');
			if (ok) {
				ESPBA.delete('produkt_ekstra', { id: peid }).then(function() {
					$scope.dtEkstraInstance.reloadData();
				})
			}
		});

//---------------------
//produkt log
		$scope.dtLogColumns = [
      DTColumnBuilder.newColumn('created_timestamp')
				.withTitle('Tidspunkt')
				.renderWith(function(data, type) {
					return type == 'display' ? moment(data).format('lll') : data
				}),

      DTColumnBuilder.newColumn('action')
				.withTitle('Aktion')
				.renderWith(function(data) {
					if (data == '+') return '<i class="fa fa-home fa-2x text-success"></i>&nbsp;Ind'
					if (data == '-') return '<i class="fa fa-shopping-cart fa-2x text-primary"></i>&nbsp;Ud'
					return '<i class="fa fa-check fa-2x"></i>&nbsp;Optælling'
				}),

      DTColumnBuilder.newColumn('antal').withTitle('Antal'),
      DTColumnBuilder.newColumn('total').withTitle('Ny total'),
		];

		$scope.dtLogOptions = DTOptionsBuilder
			.fromFnPromise(function() {
				var defer = $q.defer();
				ESPBA.get('pakke_log', { produkt_id: produkt_id }).then(function(res) {
					defer.resolve(res.data);
				});
				return defer.promise;
	    })
			.withOption('dom', 'tip') 
			.withOption('lengthChange', false)
			.withOption('pageLength', 7)
			.withOption('stateSave', false)
			.withOption('language', Utils.dataTables_daDk);


	}];

	return {
		show: function(produkt_id) {
			deferred = $q.defer();
			modal = $modal({
				controller: local.modalInstance,
				templateUrl: 'views/admin/produkt.modal.html',
				backdrop: 'static',
				locals: { 
					produkt_id: produkt_id 
				}
			});
      return deferred.promise;
		}

	}

}]);
