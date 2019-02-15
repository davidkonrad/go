'use strict';

var isLocalHost = (location.hostname === "localhost" || location.hostname === "127.0.0.1");

var defaultHTML =  `
	<section  >
	<h4>block with html</h4>
	<div id="replaceMe">content form the html file goes here</div>
	</section> 
`;


angular.module('hallandparketApp').directive('blockWithHtml', function($http, $compile) {

	return {
    restrict: 'E',
    scope: {
			url: '='
    },
		link: function link(scope, element, attrs) {
			if (attrs.url) {
				$http.get(attrs.url).then(function(snippet) {
					var $html = $(defaultHTML).clone();
					$html.find('#replaceMe').html(snippet.data);
					element.replaceWith($html[0].outerHTML);			
				})
			} else {
				element.replaceWith(defaultHTML);
			}
		}							
		/*
		loader: function(url) {
			var d = $q.defer();
			$http.get(url).then(function(snippet) {
				var $html = $(defaultHTML).clone();
				$html.find('#replaceMe').html(snippet.data);
				d.resolve( $html[0].outerHTML )
			})
			return d.promise
		},
    template: function(element, attrs) {
			if (attrs.url) {
				var d = $q.defer();
				this.loader(attrs.url).then(function(value) {
					console.log(value)
					d.resolve(value)
				})
				return d.promise
				//var d = $q.defer();
			} else {
				return defaultHTML
			}
		}
		*/
	}
});

