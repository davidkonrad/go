'use strict';

/**
 *
 * 
 */
angular.module('gulveonlineApp').controller('ProduktCtrl', ['$scope', '$routeParams', '$timeout', 'ESPBA', 'Utils', 'Lookup', 'Meta', 'DTOptionsBuilder', 'DTColumnBuilder',
	function($scope, $routeParams, $timeout, ESPBA, Utils, Lookup, Meta, DTOptionsBuilder, DTColumnBuilder) {

		var id = $routeParams.id;
		$scope.produkt = {};


		//create hidden datatable for PDF download
		function insertDataTable() {
			$('body').append('<table id="pdf" class="display" style="width:700px; display:none;"></table>');
			var data = [];
			if ($scope.produkt.sort) data.push({ key: 'Træsort', value: $scope.produkt.sort });
			if ($scope.produkt.sortering) data.push({ key: 'Kvalitet', value: $scope.produkt.sortering });
			if ($scope.produkt.overflade) data.push({ key: 'Overfladebehandling', value: $scope.produkt.overflade });
			if ($scope.produkt.profil) data.push({ key: 'Profil', value: $scope.produkt.profil });
			if ($scope.produkt.slidgruppe) data.push({ key: 'Slidgruppe', value: $scope.produkt.slidgruppe });
			if ($scope.produkt.dimension) data.push({ key: $scope.produkt.enhed_spec, value: $scope.produkt.dimension });
			if (parseFloat($scope.produkt.pakker)>0) data.push({ key: 'Pakke størrelse', value: $scope.produkt.pakker });

			$scope.produkt_ekstra.forEach(function(pe) {
				data.push({
					key: pe.key,
					value: pe.value
				})
			})

			$('#pdf').DataTable({
        dom: 'Bt',
				data: data,
				ordering: false,
				columns: [
					{ data: 'key', title: '', width: '50%' },
					{ data: 'value', title: '', width: '50%' }
				],
				buttons: [{ 
					extend: 'pdfHtml5',
					//message: Utils.plainText($scope.produkt.beskrivelse),
					header: true,
					//footer: true,
					messageTop: ' ',
					messageBottom: ' ',
					title: $scope.produkt.navn,
					filename: Utils.urlName($scope.produkt.navn),
					customize: function(doc){
						var colCount = new Array();
						$('#pdf').find('tbody tr:first-child td').each(function(){
							if ($(this).attr('colspan')) {
								for(var i=1;i<=$(this).attr('colspan');$i++){
									colCount.push('*');
								}
							} else { 
								colCount.push('*'); 
							}
						});
						//console.log(doc);
						doc.content[2].table.widths = colCount;
						doc.styles.tableHeader.alignment = 'left';
						doc.styles.title.alignment = 'left';
						doc.styles.title.fontSize = 30;

						doc.styles.tableBodyOdd.fontSize = 16;
						doc.styles.tableBodyOdd.marginLeft = 8;
						doc.styles.tableBodyOdd.marginTop = 4;
						doc.styles.tableBodyOdd.marginBottom = 4;

						doc.styles.tableBodyEven.fontSize = 16;
						doc.styles.tableBodyEven.marginLeft = 8;
						doc.styles.tableBodyEven.marginTop = 4;
						doc.styles.tableBodyEven.marginBottom = 4;

					}
				}]
			})
			$('.dt-buttons').hide()
		}

		function init() {
			ESPBA.get('produkter', { id: id }).then(function(r) {
				$scope.produkt = r.data[0];

				//store current id for kontakt
				Lookup.setPassData({ produkt_navn: $scope.produkt.navn });
				Lookup.formatProdukt($scope.produkt);

				var title = $scope.produkt.meta_title || $scope.produkt.navn;
				if (!~title.indexOf($scope.produkt.kategori)) title = $scope.produkt.kategori + ', ' + title;
				Meta.setTitle(title);

				if ($scope.produkt.meta_desc) {
					Meta.setDescription($scope.produkt.meta_desc);
				} else {
					var meta = $scope.produkt.navn + '.';
					if ($scope.produkt.kategori) {
						meta += $scope.produkt.kategori + '. ';
					}
					if ($scope.produkt.sort) {
						meta += 'Træsort '+ $scope.produkt.sort.toLowerCase() + '. ';
					}
					if ($scope.produkt.dimension) {
						meta += 'Dim. '+ $scope.produkt.dimension + '. ';
					}
					if ($scope.produkt.kvalitet) {
						meta += $scope.produkt.dimension + ' sortering. ';
					}
					if ($scope.produkt.profil) {
						meta += $scope.produkt.profil + ' profil. ';
					}
					if ($scope.produkt.slidgruppe) {
						meta += 'Slidgruppe '+ $scope.produkt.slidgruppe+'. ';
					}
					if ($scope.produkt.overflade) {
						meta += $scope.produkt.overflade + '. ';
					}
					if ($scope.produkt.pris_enhed && $scope.produkt.enhed) {
						meta += 'DKK '+ $scope.produkt.pris_enhed + ' /' + $scope.produkt.enhed + '. ';
					}
					Meta.setDescription(meta);
				}

				ESPBA.get('produkt_ekstra', { produkt_id: id }, { orderBy: 'sort_order' } ).then(function(r) {
					$scope.produkt_ekstra = r.data;
					insertDataTable();
				})
			});
		}

		$scope.downloadPDF = function() {
			$('.buttons-pdf').click()
		}

		Lookup.init().then(function() {
			init();
		});

}]);
