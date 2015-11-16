(function(window, module, undefined) {
  "use strict";

  var Omise = {};

  // private

  Omise._config = {};
  Omise._config.vaultUrl = "https://vault.omise.co";
  Omise._config.assetUrl = "https://cdn.omise.co";

  Omise._rpc = false;
  Omise.easyXDM = easyXDM.noConflict('Omise');
  Omise.easyXDM.DomHelper.requiresJSON(Omise._config.assetUrl + "/json2.js");

  Omise._createRpc = function(callback) {
    if (Omise._rpc) {
      return Omise._rpc;
    } else {
      var tm = setTimeout(function() {
        Omise._rpc.destroy();
        Omise._rpc = null;
        if(callback){
          callback();
        }
      }, 30000);
      
      Omise._rpc = new Omise.easyXDM.Rpc({
        remote: Omise._config.vaultUrl + "/provider",
        swf: Omise._config.assetUrl + "/easyxdm.swf",
        onReady: function() {
          clearTimeout(tm);
        }
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
    
    Omise._createRpc(function() {
      handler(0, { 
        code: "rpc_error", 
        message: "unable to connect to provider after timeout" 
      });
    }).createToken(Omise.publicKey, data, function(response) {
      handler(response.status, response.data);
    }, function(e){
      handler(e.data.status, e.data.data);
    });
  };

  // exports

  if (typeof module.exports === "object") {
    module.exports = Omise;
  }

  window.Omise = Omise;

})(window, typeof module === "object" ? module : {});
