'use strict';

/**
 * @ngdoc function
 * @name gulveonlineApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the gulveonlineApp
 */
angular.module('gulveonlineApp')
  .controller('NavbarCtrl', ['$scope', '$window', '$timeout', 'Login', 'ESPBA', 
	function($scope, $window, $timeout, Login, ESPBA) {
	
		$scope.isLoggedIn = Login.isLoggedIn();

		$scope.logout = function() {
			Login.logout();
			$window.location.href = '/';
			$window.location.reload();
		};

		$scope.searchTerm = undefined;
		$scope.doSearch = function() {
			$window.location.href = '#/soeg/';
		};

		ESPBA.get('kategori', {} ).then(function(r) {
			$scope.kategorier = r.data;
		});

		//restyle produkt kategorier if resize or on small devices
		function checkMenu() {
			var $pk = $('#produkt-kategorier');
			if ($window.innerWidth > 798) {
				if (!$pk.hasClass('dropdown-menu-left')) $pk.addClass('dropdown-menu-left');
			} else {
				$pk.removeClass('dropdown-menu-left');
			}
		}
		$timeout(function() {
			checkMenu();
		});

		angular.element($window).bind('resize', function () {
			checkMenu();
		});


  }]);
