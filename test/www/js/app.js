// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('newsApp', ['ionic','chart.js']);

app.controller('tabsController',function($scope,$ionicSlideBoxDelegate){
    $scope.navSlide = function(index){
      $ionicSlideBoxDelegate.slide(index,500);
    }
});

app.controller('AppCtrl', function($scope, $ionicModal) {
  
  $scope.contacts = [
    { name: 'Gordon Freeman' },
    { name: 'Barney Calhoun' },
    { name: 'Lamarr the Headcrab' },
  ];

  $ionicModal.fromTemplateUrl('templates/modal.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });
  
  $scope.createContact = function(u) {        
    $scope.contacts.push({ name: u.firstName + ' ' + u.lastName });
    $scope.modal.hide();
  };

});

app.controller('AppCtrl1', function($scope, $ionicModal) {
  
  $scope.contacts = [
    { name: 'Gordon Freeman' },
    { name: 'Barney Calhoun' },
    { name: 'Lamarr the Headcrab' },
  ];

  $ionicModal.fromTemplateUrl('templates/modal.html1', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });
  
  $scope.createContact = function(u) {        
    $scope.contacts.push({ name: u.firstName + ' ' + u.lastName });
    $scope.modal.hide();
  };

});

app.controller('AppCtrl2', function($scope, $ionicModal) {
  

  $ionicModal.fromTemplateUrl('templates/contact.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });
  

});

// Chart js
app.controller("ExampleChart", function($scope){
  $scope.labels = ["January","February","March","April","May","Jun","July"];
  $scope.series = ['Series A','Series B'];
  $scope.data = [
      [65,59,80,81,56,55,40],
      [28,46,41,19,86,27,90]
  ]; 
});

app.controller('myNewsController', function($scope, $http,$ionicSideMenuDelegate){

  $scope.news = [];

  $scope.loadMore = function(){

    var parameters = {
        id:$scope.lastarticleID
    }

    $http.get('http://localhost:8888/getinfo?list=1&status=1',{params: parameters}).success(function(items){
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
          url: "http://localhost:8888/getinfo?list=1&status=1"
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
    url: "http://localhost:8888/getinfo?list=1&status=1"
  }).then(function(newsData){
    angular.forEach(newsData.data, function(newsArticle){
        $scope.news.push(newsArticle);
    });
    // $scope.news.lastarticleID = newsData.data.lastID;
    // console.log($scope.news.lastarticleID);
  });
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
})
