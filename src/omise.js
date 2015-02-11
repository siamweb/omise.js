(function(window, undefined) {
  "use strict";

  var Omise = {};

  // private

  Omise._config = {};
  Omise._config.vaultUrl = "https://vault.omise.co";

  Omise._xdm = easyXDM.noConflict('OMISE')
  Omise._rpc = false;

  Omise._createRpc = function(){
    if (Omise._rpc) {
      return Omise._rpc;
    } else {
      Omise._rpc = new Omise._xdm.Rpc({
        remote: Omise._config.vaultUrl + "/provider"
      }, {remote: {createToken: {}}});
      return Omise._rpc;
    }
  };

  // public

  Omise.setPublicKey = function(publicKey) {
    Omise.publicKey = publicKey;
    return Omise.publicKey;
  };

  Omise.createToken = function(as, attributes, handler) {
    var data = {};
    data[as] = attributes;
    Omise._createRpc().createToken(Omise.publicKey, data, function(response) {
      handler(response.status, response.data);
    }, function(){ /* noop */ });
  };

  // exports

  window.Omise = Omise;

})(window);
