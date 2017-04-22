'use strict';

/**
 * @ngdoc overview
 * @name gulveonlineApp
 * @description
 * #gulveonlineApp
 *
 * Main module of the application.
 */
angular.module('gulveonlineApp', [
	'ngAnimate',
	'ngCookies',
	'ngResource',
	'ngRoute',
	'ngSanitize',
	'ngTouch',
	'mgcrea.ngStrap',
	'datatables',
	'datatables.buttons',
	'datatables.bootstrap',
	'datatables.select',
	'datatables.options',
	'ngTagsInput',
	'bootstrap3-typeahead',
	'textAngular',
	'textAngularSetup',
	'ngFileUpload',
	'fancyboxplus',
	'ESPBA',
	'Meta'
  ])
  .config(function ($locationProvider, $routeProvider) {

		$locationProvider.hashPrefix('');
		$locationProvider.html5Mode({
			enabled : false,
			requireBase : false
		});

    $routeProvider
      .when('/', {
        templateUrl: 'views/frontpage.html',
        controller: 'FrontpageCtrl',
        controllerAs: 'frontpage'
      })
			/*
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
	    .when('/om-gulve-online', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
			*/
      .when('/kontakt', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .when('/produkt-oversigt', {
        templateUrl: 'views/indeks.html',
        controller: 'IndeksCtrl',
        controllerAs: 'indeks'
      })

      .when('/produkt/:id/:id', {
        templateUrl: 'views/produkt.html',
        controller: 'ProduktCtrl',
        controllerAs: 'produkt'
      })
      .when('/kategori/:id/:id', {
        templateUrl: 'views/kategori.html',
        controller: 'KategoriCtrl',
        controllerAs: 'kategori'
      })

			//undersider
      .when('/vilkaar-og-betingelser', {
        templateUrl: 'views/underside.html',
        controller: 'UndersideCtrl',
        controllerAs: 'underside'
      })
      .when('/referencer', {
        templateUrl: 'views/underside.html',
        controller: 'UndersideCtrl',
        controllerAs: 'underside'
      })
      .when('/om-gulve-online', {
        templateUrl: 'views/underside.html',
        controller: 'UndersideCtrl',
        controllerAs: 'underside'
      })
      .when('/levering', {
        templateUrl: 'views/underside.html',
        controller: 'UndersideCtrl',
        controllerAs: 'underside'
      })


			//administration
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl',
        controllerAs: 'login'
      })
	   .when('/admin-produkter', {
        templateUrl: 'views/admin.produkter.html',
        controller: 'AdminProdukterCtrl',
        controllerAs: 'admin'
      })
	   .when('/admin-tilbud', {
        templateUrl: 'views/admin.tilbud.html',
        controller: 'AdminTilbudCtrl',
        controllerAs: 'admin'
      })
	   .when('/admin-undersider', {
        templateUrl: 'views/admin.underside.html',
        controller: 'AdminUndersideCtrl',
        controllerAs: 'admin'
      })
	   .when('/admin-enhed', {
        templateUrl: 'views/admin.enhed.html',
        controller: 'AdminEnhedCtrl',
        controllerAs: 'admin'
      })
	   .when('/admin-sort', {
        templateUrl: 'views/admin.sort.html',
        controller: 'AdminSortCtrl',
        controllerAs: 'admin'
      })
	   .when('/admin-kategori', {
        templateUrl: 'views/admin.kategori.html',
        controller: 'AdminKategoriCtrl',
        controllerAs: 'admin'
      })
	   .when('/admin-kvalitet', {
        templateUrl: 'views/admin.kvalitet.html',
        controller: 'AdminKvalitetCtrl',
        controllerAs: 'admin'
      })
	   .when('/admin-overflade', {
        templateUrl: 'views/admin.overflade.html',
        controller: 'AdminOverfladeCtrl',
        controllerAs: 'admin'
      })

      .otherwise({
        redirectTo: '/'
      });

  })
	.run(function($location, Lookup, ESPBA, Meta) {
		if ($location.host() == 'localhost') {
			ESPBA.setHost('http://localhost/html/gulveonline/app/')
		} else {
			ESPBA.setHost('http://gulve.online/')
		}
		ESPBA.setApiPath('api/espba.php');	

		Lookup.init();
		Meta.setTitleSuffix(' :: gulve-online');		

	});


