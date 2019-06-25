'use strict';

/**
 *
 *
 */
angular.module('hallandparketApp').factory('SelectImageModal', ['$modal', '$q', function($modal, $q) {

	var modal;
	var deferred;
	var local = this;

	local.modalInstance = ['$scope', '$http', 'Utils', function($scope, $http, Utils) {

		$http({
			url: Utils.apiPath() + 'list-images.php', 
			method: 'GET'
		}).then(function(r) {
			r.data.images.splice(0,2)
			$scope.images = r.data.images
			$scope.pages = []
			var pageCount = Math.abs($scope.images.length/30)
			for (var i=0; i<pageCount; i++) {
				var p = i+1
				var s = 1+(p*30)-30
				var e = p*30
				$scope.pages.push({
					page: p,
					text: s+'-'+e
				})
			}

			$scope.pageImages = $scope.images.slice(0,30);

			$('body').on('click', '#modal-select-image .paginate_button a', function() {
				var page = $(this).attr('page-index')
				$scope.pageImages = $scope.images.slice(page-1,30)
				$scope.$apply()
				$('li.paginate_button').removeClass('active')
				$('li.paginate_button[page-index="'+page+'"]').addClass('active')
			})

			$('body').on('dblclick', '#modal-select-image img', function() {
				var src = $(this).attr('src').replace('media-uploads/', '')
				$scope.modalClose(src)
			})

		})

		$scope.modalClose = function(value) {
			if (modal) modal.hide();
      deferred.resolve(value)
		};
	
	}];

	return {
		show: function() {
			deferred = $q.defer();
			modal = $modal({
				controller: local.modalInstance,
				templateUrl: 'views/admin/SelectImage.modal.html',
				backdrop: 'static'
			});
      return deferred.promise;
		}
	}

}]);	

