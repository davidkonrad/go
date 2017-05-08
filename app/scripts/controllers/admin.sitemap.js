'use strict';

/**
 *
 *
 */
angular.module('gulveonlineApp')
  .controller('SitemapCtrl', ['$scope', '$window', '$timeout', 'Login', 'Utils', 'ESPBA', 
	function($scope, $window, $timeout, Login, Utils, ESPBA) {

		if (!Login.isLoggedIn()) {
			$window.location.href = '/';
		}

		var temp = '';
		temp += 'http://gulve.online/#/tilbud' + "\n";
		temp += 'http://gulve.online/#/restpartier' + "\n";
		temp += 'http://gulve.online/#/kontakt' + "\n";
		temp += 'http://gulve.online/#/referencer' + "\n";
		temp += 'http://gulve.online/#/om-gulve-online' + "\n";

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
				temp += Utils.getOversigtLink('traesort', s) + "\n";
			});
		});
		
		ESPBA.get('kvalitet', {}).then(function(kvalitet) {
			kvalitet.data.forEach(function(k) {
				temp += Utils.getOversigtLink('sortering', k) + "\n";
			});
		});

		ESPBA.get('profil', {}).then(function(profil) {
			profil.data.forEach(function(p) {
				temp += Utils.getOversigtLink('profil', p) + "\n";
			});
		});

		ESPBA.get('overflade', {}).then(function(overflade) {
			overflade.data.forEach(function(o) {
				temp += Utils.getOversigtLink('overflade-behandling', o) + "\n";
			});
		});


		$timeout(function() {
			$scope.sitemapText = temp;
		}, 2000);


}]);
