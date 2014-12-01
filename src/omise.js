(function ($, window, undefined) { "use strict";

  var Omise = {}, Base64 = {};

  // private

  Base64._keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
  Base64._utf8_encode = function(e){e=e.replace(/\r\n/g,"\n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},
  Base64.encode = function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+Base64._keyStr.charAt(s)+Base64._keyStr.charAt(o)+Base64._keyStr.charAt(u)+Base64._keyStr.charAt(a)}return t}

  var b64e = function (str) {
    return Base64.encode(str);
  };

  // public

  Omise.config = {};

  Omise.config.defaultHost = "vault.omise.co";

  Omise.config.protocol = "https://";

  Omise.url = function (path) {
    return Omise.config.protocol + Omise.config.defaultHost + path;
  };

  Omise.setPublicKey = function (publicKey) {
    Omise.publicKey = publicKey;
    Omise.authorizationHeader = "Basic " + b64e(publicKey + ":");
    return Omise.publicKey;
  };

  Omise.createToken = function (as, attributes, handler) {
    var data = {};
    data[as] = attributes;
    $.ajax(Omise.url("/tokens"), {
      "type": "POST",
      "dataType": "json",
      "data": data,
      "beforeSend": function (xhr) {
        xhr.setRequestHeader("Authorization", Omise.authorizationHeader);
      }
    }).always(function (data, textStatus, xhr) {
      handler(xhr.status, data);
    });
  };

  // exports

  window.Omise = Omise;

})(jQuery, window);
