'use strict';

angular.module('gulveonlineApp').directive('autoFocus', function($timeout) {
	return {
		restrict: 'AC',
		link: function(scope, element) {
			$timeout(function() {
				element[0].focus();
			}, 0);
		}
	};
});
