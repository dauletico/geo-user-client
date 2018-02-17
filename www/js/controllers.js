angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $ionicPlatform) {
  $ionicPlatform.ready(() => {
      $scope.deviceToken = '123454456456546';
      if (ble) {
        console.log('got ble, starting scan')
        ble.scan([], 5, (device) => {
          console.log('testtt')
            $scope.message = JSON.stringify(device);
        }, (msg) => {
          $scope.message = JSON.stringify(msg);
        });
      } else {
        $scope.message = 'BLE not available.';
      }

  });
})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
