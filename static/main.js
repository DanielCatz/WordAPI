(function () {

  'use strict';

  angular.module('WordcountApp', [])

  .controller('WordcountController', ['$scope', '$log', '$http', '$timeout',
    function($scope, $log, $http, $timeout) {

    $scope.submitButtonText = 'Submit';
    $scope.loading = false;
    $scope.urlerror= false;
    $scope.getResults = function() {


      // get the URL from the input
      var userInput = $scope.url;

      // fire the API request
      $http.post('/start', {"url": userInput}).
        success(function(results) {          
          $log.log(results);
          $scope.wordcounts=null;
          getWordCount(results);
          $scope.loading = true;
          $scope.submitButtonText="Loading...";
          $scope.urlerror = false;
        }).
        error(function(error) {
          $log.log('DAMMIT');
        });

    };

    function getWordCount(jobID) {

      var timeout = '';

      var poller = function() {
        // fire another request
        $http.get('/results/'+jobID).
          success(function(data, status, headers, config) {
            if(status === 202) {
              $log.log('fark');
            } else if (status === 200){
              $scope.wordcounts = data;

              //var due = JSON.parse(angular.toJson(data));
              // $log.log(due);
               //$log.log($scope.wordcounts);
              // for(var x =0; x<due.length;x++){
              //  for(var y =0; y<2; y++){
              //   $log.log(due[x][y]);
              // } 
              // }
              
              
              $scope.submitButtonText= "Submit"
              $scope.loading=false;              
              $timeout.cancel(timeout);
              return false;
            }
            // continue to call the poller() function every 2 seconds
            // until the timeout is cancelled
            timeout = $timeout(poller, 2000);
            $log.log('TICK');            
          }).
          error(function(error) {
            $log.log('An error');
            $scope.loading = false;
            $scope.submitButtonText = "Submit";
            $scope.urlerror = true;            
          });
      };
      poller();
    }

  }])
//end controller
.directive('wordCountChart', ['$parse', '$log', function ($parse,$log) {
  
  return {
    restrict: 'E',
    replace: true,
    template: '<div id="chart"></div>',
    link: function (scope) {
        scope.$watch('wordcounts', function() {
          d3.select('#chart').selectAll('*').remove();
  var data =[];
  data = scope.wordcounts;
  $log.log(data);
  for (var word in data) {
        

      d3.select('#chart')
      .append('div')
      .selectAll('div')
      .data(word[0])
      .enter()
      .append('div')
      .style('width', function() {
        return (data[word][1] * 20) + 'px';
      })
      .text(function(d){
        return data[word][0];
      });
  }
}, true);

    }
   };
}])

  ;



}());



