# Omise.js

## Setup

Insert the script into your page:

```html
<script src="https://cdn.omise.co/omise.js"></script>
```

or GZIP version:

```html
<script src="https://cdn.omise.co/omise.js.gz"></script>
```


Then set your public:

```js
Omise.setPublicKey("pkey_test_4xpip92iqmehclz4a4d");
```

That's it. You're good to send card data securely to our servers.

## Browser compatibility

Omise.js relies on the excellent [easyXDM](https://github.com/oyvindkinsey/easyXDM) library for communication with the API. The following browsers are supported:

* Internet Explorer 8 and above.
* Opera 9 and above.
* Firefox 1.0 and above.
* Safari 4 and above.
* Chrome 2 and above.

With the following mobile environment:

* iOS 4 and above.
* Android 2.2 and above.
* Windows Phone 8 and above.

With the following browsers operate in compatibility mode:

* Internet Explorer 6-7 if Flash is installed on user machine.
* Internet Explorer 6 requires TLS 1.0 to be enabled in the browser settings.

## API

### setPublicKey(key)

Setup your public key to authenticate against Omise API.

**Arguments:**

* `key` (required) - key is the public keys that you can find in your [dashboard](https://dashboard.omise.co) once you're signed in.

### createToken(type, object, callback)

Create a token with the API. This token should be used in place of the card number when communicating with Omise API.

**Arguments:**

* `type` (required) - type of token you want to create. For now this value must be `card`.
* `object` (required) - a javascript object containing the 5 values required for a card:  `name`, `number`, `expiration_month`, `expiration_year`, `security_code`.
* `callback`: (required) - a callback that will be triggered whenever the request with omise server completes (for both error and success). Two arguments will be passed back into the callback. The HTTP statusCode, like `200` for success or `400` for bad request, etc... The second argument is the response from the Omise API. Example:

```js
{
  "object": "token"
  "id": "tokn_test_4xqa5ym431a9v1v5vti"
  "livemode": false
  "location": "/tokens/tokn_test_4xqa5ym431a9v1v5vti"
  "used": false
  "card": {
    "object": "card"
    "id": "card_test_4xqa5ym3ashqox19d7u"
    "brand": "Visa"
    "city": null
    "country": "us"
    "created": "2014-10-15T08:46:31Z"
    "expiration_month": 10
    "expiration_year": 2028
    "financing": ""
    "fingerprint": "gfEWEbLqXu1tRjerGyS1H0S0uitlEAIwdFFBTTokIOw="
    "last_digits": "4242"
    "livemode": false
    "name": "Robin"
    "postal_code": null
    "created": "2014-10-15T08:46:31Z"
  }
}
```

## Example

Here's an example of how you could send the card data to Omise API:

```js
Omise.createToken("card", {
  "name": document.getElementById("name").value,
  "number": document.getElementById("number").value,
  "expiration_month": document.getElementById("expiration_month").value,
  "expiration_year": document.getElementById("expiration_year").value,
  "security_code": document.getElementById("security_code").value
}, function (statusCode, response) {
  if (response.object == "token") {
    // then send the token (response.id) to your server
    // ...
  } else {
    // an error occured, display error message
    alert(response.code+": "+response.message);
  };
});
```

Please note that it is important to leave `name` attribute in form `input`s to prevent the credit card data to be sent to your server. For more completed example, please refer to examples/index.html.

## How about validations?

Omise.js doesn't validate credit card data before sending them to the API. But if the card isn't valid the API will send a message in the response containing the errors. If you need client side validation you can use something like the [jQuery Credit Card Validator](http://jquerycreditcardvalidator.com) library by [PawelDecowski](https://github.com/PawelDecowski).
