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
                for (var i = 0; i < msg.characteristics.length; i++) {
                  let characteristic = msg.characteristics[i];
                  if(characteristic.characteristic.startsWith('14444444')) {
                    $scope.message += 'Now, writing to characteristic';
                    console.log('WRITING');
                    ble.write(device.id, uuid, characteristic.characteristic, stringToBytes('123454456456546'), (success) => {
                      console.log('SUCCEEEEEDDDED')
                    }, (failure) => {
                      console.log('FAILUREE')
                    });
                  }
                }
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

function stringToBytes(string) {
   var array = new Uint8Array(string.length);
   for (var i = 0, l = string.length; i < l; i++) {
       array[i] = string.charCodeAt(i);
    }
    return array.buffer;
}

