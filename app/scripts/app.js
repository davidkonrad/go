'use strict';

/**
 * @ngdoc overview
 * @name hallandparketApp
 * @description
 * #hallandparketApp
 *
 * Main module of the application.
 */
angular.module('hallandparketApp', [
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
	'Meta',
	'angular-loading-bar'
  ])
  .config(function ($locationProvider, $routeProvider, cfpLoadingBarProvider, $httpProvider) {

		//console.log($httpProvider.defaults);

    cfpLoadingBarProvider.includeSpinner = false;

		if (window.location.host == 'localhost:9000') {
			$locationProvider.html5Mode(false);
		  $locationProvider.hashPrefix('');
		} else {
			$locationProvider.html5Mode(true);
		}

    $routeProvider
      .when('/', {
        templateUrl: 'views/frontpage.html',
        controller: 'FrontpageCtrl',
        controllerAs: 'frontpage'
      })
      .when('/kontakt/', {
        templateUrl: 'views/kontakt.html',
        controller: 'KontaktCtrl',
        controllerAs: 'kontakt'
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
        templateUrl: 'views/produktList.html',
        controller: 'KategoriCtrl',
        controllerAs: 'kategori'
      })
      .when('/oversigt/:type/:navn/:id', {
        templateUrl: 'views/produktList.html',
        controller: 'OversigtCtrl',
        controllerAs: 'oversigt'
      })
      .when('/soeg', {
        templateUrl: 'views/produktList.html',
        controller: 'SearchCtrl',
        controllerAs: 'search'
      })
      .when('/tilbud', {
        templateUrl: 'views/produktList.html',
        controller: 'TilbudCtrl',
        controllerAs: 'tilbud'
      })
      .when('/restpartier', {
        templateUrl: 'views/produktList.html',
        controller: 'RestpartiCtrl',
        controllerAs: 'restpartier'
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
      .when('/om', {
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
	   .when('/admin-slidgruppe', {
        templateUrl: 'views/admin.slidgruppe.html',
        controller: 'AdminSlidgruppeCtrl',
        controllerAs: 'admin'
      })

			//general pages
	   .when('/admin-profil', {
        templateUrl: 'views/admin.profil.html',
        controller: 'AdminProfilCtrl',
        controllerAs: 'admin'
      })
	   .when('/admin-sitemap', {
        templateUrl: 'views/admin.sitemap.html',
        controller: 'SitemapCtrl',
        controllerAs: 'sitemap'
      })

      .otherwise({
        redirectTo: '/'
      });

  })
	.run(function($rootScope, $location, Lookup, ESPBA, Meta) {

		//moment
		moment.tz.setDefault("Europe/Copenhagen"); 

		$rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error){ 
			// this is required if you want to prevent the $UrlRouter reverting the URL to the previous valid location
			event.preventDefault();
		});

		if ($location.host() === 'localhost') {
			ESPBA.setHost('http://localhost/html/hallandparket/app/');
		} else {
			ESPBA.setHost('https//hallandparket.dk/');
		}
		ESPBA.setApiPath('api/espba.php');
		ESPBA.init().then(function() {
			Lookup.init();
		});


});


