angular.module('ManageDocs', ['hSweetAlert', 'ngSanitize', 'ngRoute', 'textAngular'])
.config(['$routeProvider', function($routeProvider){
    $routeProvider
     .when('/document/:id', {
      templateUrl: 'vendor/views/document.html',
      controller: 'ManageDocsDocumentCtrl'
    })
     .when('/', {
      templateUrl: 'vendor/views/list.html',
      controller: 'ManageDocsListCtrl'
    })
    .when('/creation', {
      templateUrl: 'vendor/views/creation.html',
      controller: 'ManageDocsCreationCtrl'
    })
    .otherwise({
        redirectTo: '/'
      });
}])
.controller('ManageDocsDocumentCtrl', ['$scope', '$location', '$http', 'sweet', '$routeParams', function($scope, $location, $http, sweet, $routeParams) {
        $http.get('http://localhost:7772/api/'+ $routeParams.id).success(function(data) {
                        $scope.currentItem = data;

                        $scope.editing = false;

                        $scope.removeDocument = function() {
                                    sweet.show({
                                        title: 'Confirm',
                                        text: 'Delete this document?',
                                        type: 'warning',
                                        showCancelButton: true,
                                        confirmButtonColor: '#DD6B55',
                                        confirmButtonText: "Yes, delete it!",
                                        closeOnConfirm: false
                                    }, function() {
                                        $http.delete('http://localhost:7772/api/'+$scope.currentItem.id).success(function() {
                                            sweet.show('Deleted!', 'The document has been deleted.', 'success');
                                            $location.path('/');
                                        });
                                    });
                        };

                        $scope.print = function() {
                                window.print();
                        };


                        $scope.displayDocument = function() {
                                $http.put('http://localhost:7772/api/'+$scope.currentItem.id, $scope.currentItem).success(function() {
                                            $scope.editing = false;
                                            sweet.show('The document has been saved.', '', 'success');
                                });
                 };
         });
}])
.controller('ManageDocsCreationCtrl', ['$scope', '$location', '$http', 'sweet', function($scope, $location, $http, sweet) {
        $scope.newItem = {
                content: ''
        };

        $scope.displayDocument = function() {
                $http.post('http://localhost:7772/api', $scope.newItem).success(function(data) {
                    sweet.show('The document has been saved.', '', 'success');
                    $location.path('/document/' + data.id.toString());
                    }).error(function() {
                    sweet.show('Oops...', 'Something went wrong!', 'error');
                });
        };
}])
.controller('ManageDocsListCtrl', ['$scope', '$location', '$http', function($scope, $location, $http) {
        $scope.loading = true;
        $http.get('http://localhost:7772/api').success(function(data) {
            $scope.items = data;
            $scope.short = true;
            $scope.loading = false;

            $scope.goItem = function (item) {
                $location.path('/document/' + item.id);
            };
            
            $scope.advancedSearch = function () {
                $http.get('http://localhost:7772/api/long').success(function(data) {
                    $scope.items = data;
                    $scope.short = false;
                }).error(function() {
                    sweet.show('Oops...', 'Something went wrong!', 'error');
                });
            };
        }).error(function() {
            sweet.show('Oops...', 'Something went wrong!', 'error');
        });
}]);