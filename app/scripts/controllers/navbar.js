'use strict';

/**
 * @ngdoc function
 * @name hallandparketApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the hallandparketApp
 */
angular.module('hallandparketApp')
  .controller('NavbarCtrl', ['$scope', '$window', '$location', '$timeout', 'Login', 'ESPBA', 
	function($scope, $window, $location, $timeout, Login, ESPBA) {
	
		$scope.isLoggedIn = Login.isLoggedIn();

		$scope.logout = function() {
			Login.logout();
			$window.location.href = '/';
			$window.location.reload();
		};

		$scope.searchTerm = undefined;
		$scope.doSearch = function() {
			$location.path('/soeg');
		};

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
