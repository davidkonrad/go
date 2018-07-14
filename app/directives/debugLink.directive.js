'use strict';

var isLocalHost = (location.hostname === "localhost" || location.hostname === "127.0.0.1");

angular.module('gulveonlineApp')
	.directive('debugLink', function($timeout) {
	return {
		restrict: 'A',
		link: function(scope, element, attrs) {
			$timeout(function() {			
				var href = element.attr('href');
				if (href && isLocalHost && href.charAt(0) == '/') {
					console.log(href, '#'+href);
					element.attr('href', '#'+href);
				}
			}, 100);
		}
	}
});

