angular.module('ManageDocs', ['SweetAlert', 'ngSanitize', 'ngRoute', 'textAngular'])
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
.controller('ManageDocsDocumentCtrl', ['$scope', '$location', '$windows', 'sweet', '$routeParams', function($scope, $location, $windows, sweet, $routeParams) {
        $data.get('/'+ $routeParams.id).success(function(data) {
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
                                        $windows.manager.delete('/'+$scope.currentItem.id).success(function() {
                                            sweet.show('Deleted!', 'The document has been deleted.', 'success');
                                            $location.path('/');
                                        });
                                    });
                        };

                        $scope.print = function() {
                                window.print();
                        };


                        $scope.displayDocument = function() {
                                $windows.manager.put('http://localhost:7772/api/'+$scope.currentItem.id, $scope.currentItem).success(function() {
                                            $scope.editing = false;
                                            sweet.show('The document has been saved.', '', 'success');
                                });
                 };
         });
}])
.controller('ManageDocsCreationCtrl', ['$scope', '$location', '$windows', 'sweet', function($scope, $location, $windows, sweet) {
        $scope.newItem = {
                content: ''
        };

        $scope.displayDocument = function() {
                $windows.manager.post('/', $scope.newItem).success(function(data) {
                    sweet.show('The document has been saved.', '', 'success');
                    $location.path('/document/' + data.id.toString());
                    }).error(function() {
                    sweet.show('Oops...', 'Something went wrong!', 'error');
                });
        };
}])
.controller('ManageDocsListCtrl', ['$scope', '$location', '$windows', function($scope, $location, $windows) {
        $scope.loading = true;
        $windows.manager.get('/').success(function(data) {
            $scope.items = data;
            $scope.short = true;
            $scope.loading = false;

            $scope.goItem = function (item) {
                $location.path('/document/' + item.id);
            };
            
            $scope.advancedSearch = function () {
                $windows.manager.get('/long').success(function(data) {
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