'use strict';

/**

*/

angular.module('gulveonlineApp')
  .factory('ESPBA', function($http, $location, $q) {

		if ($location.host() == 'localhost') {
			var host = 'http://localhost/html/gulveonline/app/';
		} else {
			var host = 'http://gulve.online/';
		}
		var api_path = 'api/espba.php';	

		var returnMode = 'response'; //response | json

		var process = function(r) {
			return returnMode == 'json' ? r.data : r
		}

		return {

			setHost: function(h) {
				host = h
			},

			setApiPath: function(p) {
				api_path = p
			},

			setReturnMode: function(m) {
				m = m.toString().toLowerCase();
				console.log(m);
				if (~['response', 'json'].indexOf(m)) {
					returnMode = m
				}
			},
				
			get: function(table, data, selectParams) {
				var deferred = $q.defer();
				data.__action = 'get';
				data.__table = table;

				if (selectParams) {
					if (selectParams.limit) {
						data.__limit = selectParams.limit
					}
					if (selectParams.orderBy) {
						if (typeof selectParams.orderBy == 'object') {
							data.__orderBy = selectParams.orderBy.field;
							if (selectParams.orderBy.order) data.__orderBy += ' '+selectParams.orderBy.order
						} else {
							data.__orderBy = selectParams.orderBy;
						}
					}
				}			
					
				$http({
					url: host + api_path,
					method: 'GET',
					params: data
				}).then(function(r) {
		      deferred.resolve( process(r) )
				})
	      return deferred.promise;
			},

			delete: function(table, data) {
			},

			update: function(table, data) {
				var deferred = $q.defer();
				data.__action = 'update';
				data.__table = table;
				$http({
					url: host + api_path,
					method: 'POST',
					params: data
				}).then(function(r) {
		      deferred.resolve( process(r) )
				})
	      return deferred.promise;
			},

			insert: function(table, data) {
				var deferred = $q.defer();
				data.__action = 'insert';
				data.__table = table;
				$http({
					url: host + api_path,
					method: 'POST',
					params: data
				}).then(function(r) {
		      deferred.resolve(r)
				})
	      return deferred.promise;
			}

		}		

});


