'use strict';

/**
 *
 *
 */
angular.module('gulveonlineApp')
  .controller('SitemapCtrl', ['$scope', '$window', '$timeout', 'Login', 'Utils', 'ESPBA', 'Lookup',
	function($scope, $window, $timeout, Login, Utils, ESPBA, Lookup) {

		if (!Login.isLoggedIn()) {
			$window.location.href = '/';
		}

		var temp = '';
		temp += 'https://hallandparket.dk/tilbud' + "\n";
		temp += 'https://hallandparket.dk/restpartier' + "\n";
		temp += 'https://hallandparket.dk/kontakt' + "\n";
		temp += 'https://hallandparket.dk/referencer' + "\n";
		temp += 'https://hallandparket.dk/om-gulve-online' + "\n";
		temp += 'https://hallandparket.dk/produkt-oversigt' + "\n";

		ESPBA.get('kategori', { aktiv: 1 }).then(function(kategorier) {
			kategorier.data.forEach(function(k) {
				temp += Utils.getKategoriLink(k) + "\n";
				ESPBA.get('produkter', { kategori_id: k.id, aktiv: 1 }).then(function(produkter) {
					produkter.data.forEach(function(p) {
						temp += Utils.getProduktLink(p) +"\n";
					});
				});
			});
		});

		ESPBA.get('sort', {}).then(function(sorter) {
			sorter.data.forEach(function(s) {
				if (Lookup.hasProdukterWithAttr('sort_id', s.id)) {
					temp += Utils.getOversigtLink('traesort', s) + "\n";
				}
			});
		});
		
		ESPBA.get('kvalitet', {}).then(function(kvalitet) {
			kvalitet.data.forEach(function(k) {
				if (Lookup.hasProdukterWithAttr('kvalitet_id', k.id)) {
					temp += Utils.getOversigtLink('sortering', k) + "\n";
				}
			});
		});

		ESPBA.get('profil', {}).then(function(profil) {
			profil.data.forEach(function(p) {
				if (Lookup.hasProdukterWithAttr('profil_id', p.id)) {
					temp += Utils.getOversigtLink('profil', p) + "\n";
				}
			});
		});

		ESPBA.get('overflade', {}).then(function(overflade) {
			overflade.data.forEach(function(o) {
				if (Lookup.hasProdukterWithAttr('overflade_id', o.id)) {
					temp += Utils.getOversigtLink('overflade-behandling', o) + "\n";
				}
			});
		});

		ESPBA.get('slidgruppe', {}).then(function(overflade) {
			overflade.data.forEach(function(o) {
				if (Lookup.hasProdukterWithAttr('slidgruppe_id', o.id)) {
					temp += Utils.getOversigtLink('slidgruppe', o) + "\n";
				}
			});
		});


		$timeout(function() {
			$scope.sitemapText = temp;
		}, 2000);


}]);
