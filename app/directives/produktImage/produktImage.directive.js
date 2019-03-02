'use strict';

angular.module('hallandparketApp').directive('produktImage', function($compile, $filter, $timeout) {
	return {
		restrict: 'AE',
		replace: true,
		scope: {
			path: '@',
			size: '&', //xs, sm, md, lg
		},
		template: '<div class="produkt-image-item"><div class="produkt-image-item-img cursor-pointer"></div></div>',
		link: function link(scope, element, attrs) {
			var size = attrs.size || 'md';
			var src = '/media-uploads/'+attrs.path

			element.find('.produkt-image-item-img')
				.attr({
					src: src,
					fancyboxable: '{centerOnScroll:true, helpers: {overlay:{css:{background: rgba(158, 142, 145, 0.95)}}}}'
				})
//helpers : {overlay:{css:{background:rgba(58, 42, 45, 0.95)}}}})
				.addClass('produkt-image-item-img-'+size);

			element.find('.produkt-image-item').addClass('produkt-image-item-'+size)

			$compile(element)(scope)

			var I = new Image() ;
			I.src = src
			I.onload = function() {
				var h = I.height;
				var w = I.width;
				var px = (h/w)*100;
				var py = (w/h)*100;
				var bgp = px+'% '+py+'%';
				//console.log(w,h, px, py);
				var div = element.find('.produkt-image-item-img');
				div.css('background-image', 'url('+src+')');
				div.css('background-position', bgp);
				//xdiv.css('height', '400px');
				//xdiv.css('width', '400px');
			}

		}
	}
});
