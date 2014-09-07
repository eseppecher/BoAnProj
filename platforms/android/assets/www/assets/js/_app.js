var myApp = angular.module('myApp', [
          'ngRoute', 
          'ngResource',
          'LocalStorageModule',
          'ngSanitize',
          'google-maps',
           'angular-websql'
                        
          ]);



myApp.config(['localStorageServiceProvider', function(localStorageServiceProvider){
	  localStorageServiceProvider.setPrefix('bonoway');
	  // localStorageServiceProvider.setStorageCookieDomain('example.com');
	  // localStorageServiceProvider.setStorageType('sessionStorage');
	}]);


