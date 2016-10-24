// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('ionicApp', ['ionic']);

app.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('tabs', {
      url: "/tab",
      abstract: true,
      templateUrl: "templates/tabs.html"
    })
    .state('tabs.home', {
      url: "/home",
      views: {
        'home-tab': {
          templateUrl: "templates/home.html",
          controller: 'HomeTabCtrl'
        }
      }
    })
    .state('tabs.facts', {
      url: "/facts",
      views: {
        'home-tab': {
          templateUrl: "templates/facts.html"
        }
      }
    })
    .state('tabs.facts2', {
      url: "/facts2",
      views: {
        'home-tab': {
          templateUrl: "templates/facts2.html"
        }
      }
    })
    .state('tabs.about', {
      url: "/about",
      views: {
        'about-tab': {
          templateUrl: "templates/about.html"
        }
      }
    })
    .state('tabs.navstack', {
      url: "/navstack",
      views: {
        'about-tab': {
          templateUrl: "templates/nav-stack.html"
        }
      }
    })
    .state('tabs.contact', {
      url: "/contact",
      views: {
        'contact-tab': {
          templateUrl: "templates/contact.html"
        }
      }
    });


   $urlRouterProvider.otherwise("/tab/home");

});

app.controller('HomeTabCtrl', function($scope) {
  console.log('HomeTabCtrl');
});

app.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
});

app.controller('myNewsController', function($scope, $http,$ionicSideMenuDelegate){

  $scope.news = [];

  $scope.loadMore = function(){

    var parameters = {
        id:$scope.lastarticleID
    }

    $http.get('http://codedamn.com/filesCodedamn/news.php',{params: parameters}).success(function(items){
        $scope.lastarticleID = items.lastID;
        angular.forEach(items, function(item){
          $scope.news.push(item);
        })
        $scope.$broadcast('scroll.infiniteScrollComplete');
    });
  };


  $scope.toggleLeft = function(){
    $ionicSideMenuDelegate.toggleLeft();
  };

  $scope.doRefresh = function() {
    $scope.news = [];
    $http({
          method: "GET",
          url: "http://codedamn.com/filesCodedamn/news.php"
        }).then(function(newsData){
          angular.forEach(newsData.data, function(newsArticle){
              $scope.news.push(newsArticle);
          });
          $scope.news.lastarticleID = newsData.data.lastID;
          console.log($scope.news.lastarticleID);
          $scope.lastarticleID = newsData.data.lastID;
          $scope.$broadcast('scroll.refreshComplete');
        });
       // Stop the ion-refresher from spinning
       
    
  };



  $http({
    method: "GET",
    url: "http://codedamn.com/filesCodedamn/news.php"
  }).then(function(newsData){
    angular.forEach(newsData.data, function(newsArticle){
        $scope.news.push(newsArticle);
    });
    $scope.news.lastarticleID = newsData.data.lastID;
    console.log($scope.news.lastarticleID);
  });
});
