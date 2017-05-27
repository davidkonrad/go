'use strict';

angular.module('gulveonlineApp').directive('readMore', function($timeout) {

	return {
		restrict: 'AE',

		link: function link(scope, element, attrs) {

			$timeout(function() {

				if (element[0].offsetHeight > 110) {

					var linkSuffix = new Date().getTime();
					var readMoreClass = 'readMore'+linkSuffix;
					var moreText = ' ▼  Læs mere';
					var lessText = ' ▲  Læs mindre';
					var link = 	'<code><a href="#" class="unstyled ' + readMoreClass + '">' + moreText + '</a></code>';

					element[0].style.height = '120px';				
					element[0].style.overflowY = 'hidden';
					
					$(element).after(link);
					$('body').on('click', '.' + readMoreClass, function() {
						if ($(this).text() == moreText) {
							element[0].style.height = 'auto';
							element[0].style.overflowY = 'visible';
							$(this).text(lessText);
						} else {
							element[0].style.height = '120px';				
							element[0].style.overflowY = 'hidden';
							$(this).text(moreText);
							$("body").animate({scrollTop: $(this).offset().top -100}, "fast");
						}
					});
				}

			}, 150);

		}
	}

});


