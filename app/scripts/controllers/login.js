'use strict';

/**
 * @ngdoc function
 * @name gulveonlineApp.controller:LoginCtrl
 * @description
 * #LoginCtrl
 * Controller of the gulveonlineApp
 */
angular.module('gulveonlineApp')
  .controller('LoginCtrl', ['$scope', '$window', 'ESPBA', 'Login', 'RememberMe', 
	function($scope, $window, ESPBA, Login, RememberMe) {

		/*
			arno
			77tq0&BHt092
		*/

		var rm = RememberMe.get();

		$scope.user = {
			navn: rm.m,
			password: rm.p,
			rememberMe: rm.p != ''
		};

		$scope.canLogin = function() {
			return ($scope.user.navn != '' && $scope.user.password != '')
		}

		$scope.doLogin = function() {
			Login.login($scope.user.navn, $scope.user.password, $scope.user.rememberMe).then(function(r) {
				if (r.error) {
					$scope.user.error = r.error
				} else {
					$window.location.href = '#/admin-produkter';
					$window.location.reload();
				}
			})
		}


			
  }]);
