'use strict';

angular.module('gulveonlineApp')
  .factory('Login', ['$cookies', '$timeout', '$q', 'ESPBA', 'RememberMe', 
	function($cookies, $timeout, $q, ESPBA, RememberMe) {
    
	var cookieName = 'gulve.online';
	var	currentUser = null;

	function setCookie(user) {
		var expireDate = new Date();
		expireDate.setTime(expireDate.getTime()+(2*60*60*1000)) //two hours
		$cookies.put(cookieName, JSON.stringify(user), { expires: expireDate } )
	}
	function deleteCookie() {
		$cookies.remove(cookieName)
	}

	return {

		login: function(email, password, rememberMe) {
			var deferred = $q.defer()
			deleteCookie();
			ESPBA.get('user', { navn: email, password: password }).then(function(r) {
				if (r.data && r.data[0].id) {
					currentUser = r.data[0];
					setCookie(currentUser);
					RememberMe.put(email, password, rememberMe);
		      deferred.resolve(r.data[0])
				} else {
					deferred.resolve({ error : 'Email eller password ikke korrekt.' })
				}	
			})	
			return deferred.promise;
		},

		logout: function() {
			currentUser = null;
			deleteCookie();
		},
						
		isLoggedIn: function() {
			if (currentUser) {
				return true
			} else {
				var s = $cookies.get(cookieName);
				if (s) {
					currentUser = JSON.parse(s)
					setCookie(currentUser) //force update of expire					
					return true
				}
			}
			return false
		},

		updateCookie: function() {
			if (typeof currentUser.user_id != 'number') return
			MysqlUser.query({ where : { user_id: currentUser.user_id }}).$promise.then(function(response) {
				currentUser = response[0];
				setCookie(currentUser); //...
			})	
		},

		currentUser: function() {
			return currentUser
		}


	}

}]);
   

