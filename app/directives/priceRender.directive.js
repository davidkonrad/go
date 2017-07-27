'use strict';

angular.module('gulveonlineApp')
  .directive('priceRender', function($compile, $filter, $timeout) {

	var defaultPrice = 'Ring og spørg efter pris';

	return {
		restrict: 'A',
		priority: 100,
		replace: false,
		link: function (scope, element, attrs) {
			attrs.$observe('priceRender', function(produkt) {
				var p = JSON.parse(produkt);
				console.log(p);
			});
			/*
			scope.$watch('test', function(new_, old_) {
				console.log(new_);
			}, true);
			*/

			$timeout(function() {
				var p = attrs.priceRender ? JSON.parse(attrs.priceRender) : false;
				var html = '';
				//if (p.en
				//element.html( $filter('currency')(p.pris_enhed) );
				//console.log(p);
			}, 100)
			//return 'dette er en test';
			//element.html('dette er en test')
		}
		/*		
            if(attrs.details){
                scope.details = scope.$eval(attrs.details);
            }
        }
    template: function(element, attrs) {
			//var p = attrs.priceRender || false;
			var p = scope.$eval(attrs.details);
			console.log(p);
			if (!p) return defaultPrice;
			console.log($filter('currency')(p.pris_enhed));
			return $filter('currency')(p.pris_enhed)
		}
		*/
	}

});


