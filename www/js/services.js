angular.module('starter.services', [])

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  var proofs = JSON.parse(localStorage.proofs);

  return {
    all: function() {
      return proofs;
    }
  };
});
