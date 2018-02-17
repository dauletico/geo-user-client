angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $ionicPlatform) {
  $ionicPlatform.ready(() => {
      $scope.deviceToken = '123454456456546';
      if (ble) {
        ble.scan([], 5, (device) => {
          // on success
          if(device.advertising && device.advertising.kCBAdvDataServiceUUIDs && device.advertising.kCBAdvDataServiceUUIDs.length > 0) {
            let uuid = device.advertising.kCBAdvDataServiceUUIDs[0];
            // check if device is our peripheral
            if(uuid.startsWith('15555555')) {
              $scope.message = 'Got device with id: ' + device.id + '. Connecting...';
              console.log(device.id);
              ble.connect(device.id, (msg) => {
                $scope.data = JSON.stringify(msg);
                console.log('AAAAAAAAAAA')
                console.log(msg)
                // ble.write(device.id, uuid, '', data, success, failure);
              }, (err) => {
                $scope.data = JSON.stringify(err);
              });
            }
          }
        }, (msg) => {
          // Failure
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
