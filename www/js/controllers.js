angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $ionicPlatform) {
  var discoveredDevice;
  var uuid;

  $ionicPlatform.ready(() => {
      $scope.deviceToken = '123454456456546';
      $scope.scan = () => {
        discoverDevice(ble, $scope);
      };

      $scope.connect = () => {
        connectToDevice(ble, discoveredDevice, uuid, $scope);
      }

      discoverDevice(ble, $scope);
  });

  function discoverDevice(ble, $scope) {
    var isScanDone = false;
    if(!discoveredDevice) {
      $scope.message = 'Searching for devices...'
    }
    ble.scan([], 3, (device) => {
      // on success
      if(device.advertising && device.advertising.kCBAdvDataServiceUUIDs && device.advertising.kCBAdvDataServiceUUIDs.length > 0) {
        uuid = device.advertising.kCBAdvDataServiceUUIDs[0];
        // check if device is our peripheral
        if(isScanDone) return;
        if(uuid.startsWith('15555555')) {
          discoveredDevice = device;
          $scope.message = 'Got device with id: ' + device.id + '. Would you like to conenct?';
          isScanDone = true;
        }
      }
    }, (msg) => {
      // Failure
      // $scope.message = JSON.stringify(msg);
    });
    
  }


  function connectToDevice(ble, device, uuid, $scope) {
    ble.connect(device.id, (msg) => {
      $scope.message = $scope.message + 'Connected...';
      for (var i = 0; i < msg.characteristics.length; i++) {
        let characteristic = msg.characteristics[i];
        if(characteristic.characteristic.startsWith('14444444')) {
          $scope.message = $scope.message + 'Now, writing to characteristic';
          ble.write(device.id, uuid, characteristic.characteristic, stringToBytes('123454456456546'), (success) => {
            console.log(success);
            $scope.data = JSON.stringify(success);
          }, (failure) => {
          });
        }
      }
    }, (err) => {
      $scope.data = JSON.stringify(err);
    });
  }

  function stringToBytes(string) {
     var array = new Uint8Array(string.length);
     for (var i = 0, l = string.length; i < l; i++) {
         array[i] = string.charCodeAt(i);
      }
      return array.buffer;
  }

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
