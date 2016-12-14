
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
  var dates = [];
  var z;
  var obj = {content:null};
  $scope.dates = [];
  var xaxis1 = [];
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
    }else{
        $http({
          method:"GET",
          url: "http://www.codingyourfuture.com/node/getdata?id="+nodeid
        }).then(function(newsData){
            // angular.forEach(newsData.data, function(dates){
            //     $scope.dates.push(dates);
            // });
            // console.log($scope.dates);

            $scope.news.push(newsData.data);
            var t=1;
            var tempdate;
              for(var j=0;j<$scope.news[0].length;j++){

                  co.push(Number($scope.news[0][j].data.co));
                  dust.push(Number($scope.news[0][j].data.dust));
                  gas.push(Number($scope.news[0][j].data.gas));
                  nhietdo.push(Number($scope.news[0][j].data.temp));
                  xaxis1.push($scope.news[0][j].time);
                  xaxis.push($scope.news[0][j].time.substring(0,10));
                  if(t==1){
                      $scope.dates.push($scope.news[0][j].time.substring(0,10));
                      tempdate = $scope.news[0][j].time.substring(0,10);
                  }else{
                    if(tempdate != $scope.news[0][j].time.substring(0,10) ){
                      $scope.dates.push($scope.news[0][j].time.substring(0,10));
                      tempdate = $scope.news[0][j].time.substring(0,10);
                    }
                  }



                  t++;
                  z= j;
              }

        });
        var alerPopup = $ionicPopup.alert({
          Title: 'Date',
          template:'Choose Date!'
        });
        


      };
 
    }

    $scope.selectedItemChanged = function(selectedItem){
      var co1 = [];
      var dust1 = [];
      var gas1 = [];
      var temp1 = [];
      var x2 = [];
      $scope.calculatedValue = 'You selected number ' + selectedItem.modal;
      for(var k = 0; k <= z; k++ ){
          if (xaxis[k] == selectedItem){
            co1.push(Number(co[k]));
            dust1.push(Number(dust[k]));
            gas1.push(Number(gas[k]));
            temp1.push(Number(nhietdo[k]));
            x2.push(xaxis1[k].substring(11,19));
          }
      }
      // console.log(x2[0].substring(11,19));
      $scope.labels1 = x2;
      $scope.series1 = ['CO','Dust','Gas','Temp'];
      $scope.data1 = [
          co1,
          dust1,
          gas1,
          temp1
      ];
    }

    

});

// static
app.controller("StaticChart", function($scope,$http){
    var numberdata = [];
    var numbernode = []
    var Sxaxis = [];
    $scope.docs = [];
    $scope.docs1 = [];
    $scope.record = [];
    $http({
          method:"GET",
          url: "http://www.codingyourfuture.com/node/monthlyrecord"
        }).then(function(records){
          $scope.docs = records.data.record;
          $scope.docs1 = records.data.nodes;
          var t = records.data.record.length;
          for(var j=0;j< t;j++){
            numberdata.push(Number(records.data.record[j].reduction));
            numbernode.push(Number(records.data.nodes[j].reduction));
            Sxaxis.push(records.data.record[j].group[1] + "-" + records.data.record[j].group[0]);
          }
          $scope.labels = Sxaxis;
          $scope.series = ['Records', 'Nodes'];
          $scope.data = [
            numberdata,
            numbernode
          ];
  
          console.log($scope.docs);
           console.log($scope.docs1);
        });

      
});

app.controller('myNewsController', function($scope, $http,$ionicSideMenuDelegate,$ionicLoading,$compile){

  $scope.news = [];

  $scope.loadMore = function(){

    var parameters = {
        id:$scope.lastarticleID
    }

    $http.get('http://www.codingyourfuture.com/node/getinfo?list=1&status=1',{params: parameters}).success(function(items){

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
          url: "http://www.codingyourfuture.com/node/getinfo?list=1&status=1"
        }).then(function(newsData){
          angular.forEach(newsData.data, function(newsArticle){
              $scope.news.push(newsArticle);
          });
          $scope.news.lastarticleID = newsData.data.length;
          console.log($scope.news.lastarticleID);
          $scope.lastarticleID = newsData.data.lastID;
          $scope.$broadcast('scroll.refreshComplete');
        });
       // Stop the ion-refresher from spinning


  };





  $http({
    method: "GET",
    url: "http://www.codingyourfuture.com/node/getinfo?list=1&status=1"
  }).then(function(newsData){
    angular.forEach(newsData.data, function(newsArticle){
        $scope.news.push(newsArticle);
    });
    // $scope.news.lastarticleID = newsData.data.lastID;
    console.log($scope.news);
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
