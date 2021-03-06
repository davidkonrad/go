'use strict';

/**
 * Meta service
 * Easy access to meta tags in a single page application
 *
 * @version v0.0.1 - sat 16 april 2017
 * @author David Konrad (davidkonrad@gmail.com)
 * @license MIT (https://opensource.org/licenses/MIT)
**/

angular.module('Meta', []).factory('Meta', ['$route', function($route) {

		var titlePrefix = '';
		var titleSuffix = '';

		/**
     * return a certain tag; the tag is created if it not exists
    **/
		function getTag(tagName, attrName, name) {
			var head = document.getElementsByTagName('head')[0];
			var tags = document.getElementsByTagName(tagName);
			var t;

			for (var i=0, l=tags.length; i<l; i++) {
				t = tags[i];

				//if no attrName and no name, just return the very first tag
				if (!attrName && !name) return t;

				if (t.hasAttribute(attrName)) {
					//if name not is set it is a match, return the tag
					if (!name) return t;

					if (t.getAttribute(attrName) == name) {
						return t;
					}
				}
			}				

			var newTag = document.createElement(tagName);
			if (attrName) newTag.setAttribute(attrName, name ? name : '');
			head.insertBefore(newTag, head.firstChild);
			return newTag;
		}


		return {

			setTitlePrefix: function(t) {
				titlePrefix = t
			},

			setTitleSuffix: function(t) {
				titleSuffix = t
			},

			setTitle: function(t) {
				t = t.toString().substring(0, 75);
				getTag('title').innerText = titlePrefix + t + titleSuffix;
			},

			setDescription: function(d) {
				d = d.toString().substring(0, 165);
				getTag('meta', 'name', 'description').setAttribute('content', d);
			},

		}

}]);

