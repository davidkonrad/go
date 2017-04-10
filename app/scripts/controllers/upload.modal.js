'use strict';

angular.module('gulveonlineApp')
  .factory('UploadModal', ['$modal', '$location', '$compile', '$q', '$timeout', 'Upload', 
		function($modal, $location, $compile, $q, $timeout, Upload) {

		var deferred = null;
		var modal = null;
		var	name = 'uploadModal';

		return {
			
			show: function($scope) {

				if ($location.host() == 'localhost') {
					var url = 'http://localhost/html/gulveonline/app/api/upload-image.php'
				} else {
					var url = 'http://gulve.online/api/upload-image.php'
				}				

				$scope.uploadFile = function() {
					var file = $scope.selectedFile;
					Upload.upload({
						url: url, 
						method: 'POST',
						file: file,
						data: {
			        'targetPath' : '../media-uploads/'
						}
					}).then(function(r) {
						modal.hide()
			      deferred.resolve(r.data)
					}) 
				};

				$scope.registerFile = function(file, errFiles) {
        	$scope.f = file;
					$scope.errFile = errFiles && errFiles[0];
					$scope.selectedFile = file

					$timeout(function() {
						$(window).trigger('resize')
						$scope.$apply()
					})
		    }
 
				deferred = $q.defer()
				modal = $modal({
					scope: $scope,
					templateUrl: 'views/upload.modal.html',
					backdrop: 'static',
					show: true
				})

				modal.$promise.then(modal.show).then(function() {
					delete $scope.selectedFile
					$compile(angular.element('#upload-image-modal').contents())($scope)
					//
				})

				$scope.modalClose = function(value) {
					modal.hide()
		      deferred.resolve(value)
				}

				angular.element('body').on('keydown keypress', function(e) {
					if (e.charCode == 13) $scope.modalClose(true)
				})

	      return deferred.promise;
			}

		}

	}]);


