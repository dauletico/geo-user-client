angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $ionicPlatform, $interval) {
  var discoveredDevice;
  var uuid;
  var responseString;
  var numCallbackTimes;

  $ionicPlatform.ready(() => {
      if (!localStorage.uuid) {
        localStorage.uuid = guid();
      }
      if (!localStorage.proofs) {
        localStorage.proofs = '[]';
      }
      if (localStorage.anonymizeVerifications == null) {
        localStorage.anonymizeVerifications = 0;
      }
      console.log(localStorage.proofs);
      $scope.deviceToken = localStorage.uuid;
      $scope.scan = () => {
        discoverDevice(ble, $scope);
      };
      console.log(localStorage.anonymizeVerifications);

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
        // check if device is our peripheral
        if(isScanDone) return;
        if(device.advertising.kCBAdvDataServiceUUIDs[0].startsWith('15555555')) {
          uuid = device.advertising.kCBAdvDataServiceUUIDs[0];
          discoveredDevice = device;
          $scope.message = 'Found device matching protocol: ' + device.name + '. Would you like to conenct?';
          isScanDone = true;
        }
      }
    }, (msg) => {
      // Failure
      // $scope.message = JSON.stringify(msg);
    });
    
  }

  function connectToDevice(ble, device, uuid, $scope) {
    $scope.message = 'Successfully checked in with device.';
    ble.connect(device.id, (msg) => {
      for (var i = 0; i < msg.characteristics.length; i++) {
        let characteristic = msg.characteristics[i];
        if(characteristic.characteristic.startsWith('14444444')) {
          numCallbackTimes = 0;
          responseString = '';
          ble.startNotification(device.id, uuid, characteristic.characteristic, (buffer) => {
            numCallbackTimes++;
            responseString += new TextDecoder("utf-8").decode(new Uint8Array(buffer));
            if (numCallbackTimes == 2) {
              // gathered everything
              let parts = responseString.split('|');
              let proofs = JSON.parse(localStorage.proofs);
              proofs.push({
                signature: parts[0],
                message: localStorage.uuid + '|' + parts[1],
                address: parts[2]
              });
              localStorage.proofs = JSON.stringify(proofs);
              console.log(JSON.stringify(localStorage.proofs));
            }
          }, (failure) => {
          });
          ble.write(device.id, uuid, characteristic.characteristic, stringToBytes(localStorage.anonymizeVerifications + '|' + localStorage.uuid), (success) => {
            console.log('success')
          }, (failure) => {
            console.log('failed')
          });
        }
      }
    }, (err) => {
      $scope.data = JSON.stringify(err);
    });
  }

  function guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
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

  $scope.proofs = Chats.all();
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope, $ionicPlatform, ) {
  $scope.anonymizeVerifications = localStorage.anonymizeVerifications == 1;
  $scope.token = localStorage.uuid;
  $scope.updateVerifications = function() {
    localStorage.anonymizeVerifications = $scope.anonymizeVerifications ? 0 : 1;
  };
});
