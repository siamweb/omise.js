# Omise.js

## Setup

Insert the script into your page:

```html
<script src="https://cdn.omise.co/omise.js"></script>
```

Then set your public:

```html
Omise.setPublicKey("pkey_test_4xpip92iqmehclz4a4d");
```

That's it. You're good to send card data securely to our servers.

*Note that Omise.js requires jQuery.*

## API

### `setPublicKey(key)`

Setup your public key to authenticate against Omise API.

#### Arguments

`key` (required) - key is the public keys that you can find in your [dashboard](https://dashboard.omise.co) once you're signed in.

### `createToken(type, object, callback)`

#### Arguments

`type` (required) - type of token you want to create. For now this value must be `card`.

`object` (required) - a javascript object containing the 5 values required for a card:  `name`, `number`, `expiration_month`, `expiration_year`, `security_code`.

`callback`: (required) - a callback that will be triggered whenever the request with omise server completes (for both error and success). Two arguments will be passed back into the callback. The HTTP statusCode, like `200` for success or `400` for bad request, etc... The second argument is the response from the Omise API. Example:

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
var card = documents.forms.card;
Omise.createToken("card", {
  "name": card.holder_name.value,
  "number": card.number.value,
  "expiration_month": card.expiration_month.value,
  "expiration_year": card.expiration_year.value
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
