(function(window, undefined) {
  "use strict";

  var Omise = {};

  // private

  Omise._config = {};

  Omise._config.defaultHost = "vault.omise.co";

  Omise._config.protocol = "https://";

  Omise._config.provider = Omise._config.protocol +
    Omise._config.defaultHost +
    "/provider";

  Omise._xdm = easyXDM.noConflict('OMISE')

  Omise._rpc = new Omise._xdm.Rpc({remote: Omise._config.provider}, {
    remote: {createToken: {}}
  });

  // public

  Omise.setPublicKey = function(publicKey) {
    Omise.publicKey = publicKey;
    return Omise.publicKey;
  };

  Omise.createToken = function(as, attributes, handler) {
    var data = {};
    data[as] = attributes;
    Omise._rpc.createToken(Omise.publicKey, data, function(response) {
      handler(response.status, response.data);
    }, function(){ /* noop */ });
  };

  // exports

  window.Omise = Omise;

})(window);
