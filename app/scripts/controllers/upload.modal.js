'use strict';

angular.module('hallandparketApp').factory('UploadModal', ['$modal', '$location', '$compile', '$http', '$q', '$timeout', 'Upload', 
	function($modal, $location, $compile, $http, $q, $timeout, Upload) {

		var deferred = null;
		var modal = null;

		var path;
		if ($location.host() === 'localhost') {
			path = 'http://localhost/hallandparket/app/api/';
		} else {
			path = 'https://hallandparket.dk/api/';
		}

		return {

			delete: function(filename) {
				deferred = $q.defer();
				$http({
					url: path + 'delete-image.php', 
					method: 'GET',
					params: { filename: filename }
				}).then(function(r) {
		      deferred.resolve(r);
				});
	      return deferred.promise;
			},				
				
			show: function($scope) {
				$scope.selectedFile = null;
				$scope.uploadFile = function() {
					if ($scope.selectedFile) {
						Upload.upload({
							url: path + 'upload-image.php', 
							method: 'POST',
							file: $scope.selectedFile,
							data: {
				        'targetPath' : '../media-uploads/'
							}
						}).then(function(r) {
							modal.hide();
				      deferred.resolve(r.data);
						});
					} else {
			      deferred.resolve(false);
					}
				};

				$scope.canUpload = function() {
					return $scope.selectedFile !== null;
				};

				$scope.triggerSelect = function() {
					angular.element('#selectBtn').click();
				};

				$scope.registerFile = function(file, errFiles) {
        	$scope.f = file;
					$scope.errFile = errFiles && errFiles[0];
					$scope.selectedFile = file;

					$timeout(function() {
						$(window).trigger('resize');
						$scope.$apply();
					});
		    };
 
				deferred = $q.defer();
				modal = $modal({
					scope: $scope,
					templateUrl: 'views/admin/upload.modal.html',
					backdrop: 'static',
					keyboard: true,
					show: false
				});

				modal.$promise.then(modal.show).then(function() {
					console.log('ok')
					delete $scope.selectedFile;
					$compile(angular.element('#upload-image-modal').contents())($scope);
					$timeout(function() {
						$('#image-upload-cancel').focus()
					},1)
				});

				$scope.modalClose = function(value) {
					modal.hide();
		      deferred.resolve(value);
				};

	      return deferred.promise;
			}

		};

}]);

