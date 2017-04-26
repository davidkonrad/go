'use strict';

/**
 *
 *
 */
angular.module('gulveonlineApp')
  .controller('KontaktCtrl', ['$scope', '$routeParams', '$timeout', '$http', 'ESPBA', 'Lookup', 'Meta',
	function($scope, $routeParams, $timeout, $http, ESPBA, Lookup, Meta) {

		$scope.formular = {};
		
		Meta.setTitle('Kontakt os');
		Meta.setDescription('Kontakt gulve.online. Du kan udfylde vores kontaktformular, ringe eller selv skrive email til os.');

		//set stored produkt navn, passed from produkt
		var p = Lookup.getPassData();
		if (p && p.produkt_navn) {
			$scope.formular.emne = p.produkt_navn;
		}

		//test
		//$scope.success = true;

		$scope.canSend = function() {
			var ok = $scope.formular.emne > '' &&
				$scope.formular.navn > '' &&
				$scope.formular.email > '' &&
				$scope.formular.email_repeat > '' &&
				$scope.formular.email === $scope.formular.email_repeat; 
			return ok;
		};

		$scope.sendFormular = function() {
			$scope.progress = true;
			//just reuse ESPBA settings
			var url = ESPBA.getHost() + 'api/kontakt.php';
			$http({
				url: url,
				method: 'GET',
				params: $scope.formular
			}).then(function(res) {
				$scope.progress = false;
				$scope.success = res.data.message === true;
				console.log(res);
			});
		};

		$scope.resetFormular = function() {
			$scope.formular = {};
			angular.element('#emne').focus();
		};

		$timeout(function() {
			angular.element('#emne').focus();
		});

}]);

