(function ($, window, undefined) { "use strict";
  $(document).ready(function () {

    Omise.config.defaultHost = "vault.omise-gateway.dev";
    Omise.config.protocol = "http://";

    Omise.setPublicKey("pkey_test_4xpip92iqmehclz4a4d");

    $("#card").submit(function () {
      var form = $(this);
      Omise.createToken("card", {
        "name": form.find("#card_name").val(),
        "number": form.find("#card_number").val(),
        "expiration_month": form.find("#card_expm").val(),
        "expiration_year": form.find("#card_expy").val()
      }, function (statusCode, response) {
        if (response.object == "token") {
          $("#response").html(response.id);
        } else {
          $("#response").html(response.code+": "+response.message)
        };
      });
      return false;
    });

  });
})(jQuery, window);
