
// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('newsApp', ['ionic','chart.js']);
app.config(['$ionicConfigProvider', function($ionicConfigProvider) {

    $ionicConfigProvider.tabs.position('bottom'); // other values: top

}]);

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

app.controller('MapCtrl', function($scope, $ionicModal) {
  

  $ionicModal.fromTemplateUrl('templates/googlemap.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });
  

});


// Chart js
app.controller("ExampleChart", function($scope,$http,$ionicPopup,$timeout){
  var co = [];
  var dust =[];
  var gas = [];
  var nhietdo = [];
  var xaxis = [];
  var temp;
  var nodeid;
  var obj = {content:null};
  $scope.getNodeid = function(infodata){
    $scope.news = [];
    
    $scope.value = infodata;
    temp = $scope.value;
    nodeid = temp.NodeID;
    console.log(nodeid);
    var number = parseInt(nodeid);
    console.log(number);
    if(isNaN(number)){
      var alerPopup = $ionicPopup.alert({
        Title: 'Validation',
        template:'Only Number Allowed!'
      });
      alertPopup.then(function(res){
        console.log('Please enter valid number');
      });
    }else{
        $http({
          method:"GET",
          url: "http://www.codingyourfuture.com/getdata?id="+nodeid
        }).then(function(newsData){
        
            $scope.news.push(newsData.data);
            var t=1;
              for(var j=0;j<$scope.news[0].length;j++){
               
                  co.push(Number($scope.news[0][j].data.co));
                  dust.push(Number($scope.news[0][j].data.dust));
                  gas.push(Number($scope.news[0][j].data.gas));
                  nhietdo.push(Number($scope.news[0][j].data.temp));
                  // xaxis.push($scope.news[0][j].time);
                  xaxis.push(Number(t));
                  t++;
              }
       
              console.log(co);
              console.log(dust);
              console.log(gas);
              console.log(nhietdo);
              console.log(xaxis);
        });
       
        
      };

      
      $scope.labels = xaxis;
      $scope.series = ['CO','Dust','Gas','Temp'];
      $scope.data = [
          co,
          dust,
          gas,
          nhietdo
      ]; 
    }
});
// app.controller('MapCtrl1', function($scope, $ionicLoading, $compile){
//   function initialize() {
//         var myLatlng = new google.maps.LatLng(43.07493,-89.381388);
        
//         var mapOptions = {
//           center: myLatlng,
//           zoom: 16,
//           mapTypeId: google.maps.MapTypeId.ROADMAP
//         };
//         var map = new google.maps.Map(document.getElementById("map"),
//             mapOptions);
        
//         //Marker + infowindow + angularjs compiled ng-click
//         var contentString = "<div><a ng-click='clickTest()'>Click me!</a></div>";
//         var compiled = $compile(contentString)($scope);

//         var infowindow = new google.maps.InfoWindow({
//           content: compiled[0]
//         });

//         var marker = new google.maps.Marker({
//           position: myLatlng,
//           map: map,
//           title: 'Uluru (Ayers Rock)'
//         });

//         google.maps.event.addListener(marker, 'click', function() {
//           infowindow.open(map,marker);
//         });

//         $scope.map = map;
//       }
//       google.maps.event.addDomListener(window, 'load', initialize);
      
//       $scope.centerOnMe = function() {
//         if(!$scope.map) {
//           return;
//         }

//         $scope.loading = $ionicLoading.show({
//           content: 'Getting current location...',
//           showBackdrop: false
//         });

//         navigator.geolocation.getCurrentPosition(function(pos) {
//           $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
//           $scope.loading.hide();
//         }, function(error) {
//           alert('Unable to get location: ' + error.message);
//         });
//       };
      
//       $scope.clickTest = function() {
//         alert('Example of infowindow with ng-click')
//       };
// });

app.controller('myNewsController', function($scope, $http,$ionicSideMenuDelegate,$ionicLoading,$compile){

  $scope.news = [];

  $scope.loadMore = function(){

    var parameters = {
        id:$scope.lastarticleID
    }

    $http.get('http://www.codingyourfuture.com/getinfo?list=1&status=1',{params: parameters}).success(function(items){

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
          url: "http://www.codingyourfuture.com/getinfo?list=1&status=1"
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
    url: "http://www.codingyourfuture.com/getinfo?list=1&status=1"
  }).then(function(newsData){
    angular.forEach(newsData.data, function(newsArticle){
        $scope.news.push(newsArticle);
    });
    // $scope.news.lastarticleID = newsData.data.lastID;
    // console.log($scope.news.lastarticleID);
  });

  // Send Feedback
  $scope.sendFeedback = function(){
    if(window.plugins && window.plugins.emailComposer){
      window.plugins.emailComposer.showEmailComposerWithCallback(function(result){
        console.log("Response -> " + result);
      },
            "Feedback for your App", // Subject
            "",                      // Body
            ["manhcuong3010a9@gmail.com"],    // To
            'Hello',                    // CC
            null,                    // BCC
            false,                   // isHTML
            null,                    // Attachments
            null);                   // Attachment Data
      }
    }



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

