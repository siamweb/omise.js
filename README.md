# Omise.js

## Setup

Insert Omise.js script into your page, you can select from our two CDNs

Primary CDN (Singapore)
```html
<script src="https://cdn.omise.co/omise.js.gz"></script>
```

Secondary CDN (Japan)
```html
<script src="https://cdn2.omise.co/omise.js.gz"></script>
```

For uncompressed version, remove .gz extension.


#### Then set your public key in a `script` tag

```js
Omise.setPublicKey("pkey_test_4xpip92iqmehclz4a4d");
```

That's it. You're good to send card data securely to Omise servers.

## Build distribution
`npm run dist -- --payjs=[version]`.
- `version` - Version of Pay.js.

**Example**
```shell
npm run dist -- --payjs=2.0.0
```

## API

### OmiseCard.configure(config)

Set default configuration.
  - `{Object} config` - new default config.

This is list of available configure.

| name | type | default value | description |
| --- | --- | --- | --- |
| key                  | String   | '' | Set your public key here
| amount               | String   | 0 | Money amount
| currency             | String   | 'THB' | Currency for amount (THB,USD,JPY)
| image                | String   | '' | Image url
| frameLabel           | String   | 'Omise' | Form header text
| frameDescription     | String   | 'Secured by Omise' | Form description
| submitLabel          | String   | 'Checkout' | Text for submit button
| location             | String   | 'no' | Show location field or not
| submitAuto           | String   | 'yes' | Automatic submit form
| submitFormTarget     | String   | '' | Form target for submit
| locale               | String   | 'en' | Locale for form
| onCreateTokenSuccess | Function | `function() {}` | callback fire after create token success

**Example**
```js
OmiseCard.configure({
  publicKey: 'YOUR_PUBLIC_KEY',
  submitFormTarget: '#form-new-target',
  submitAuto: 'no',
  onCreateTokenSuccess: function(token) {
    alert('TOKEN: ' + token);
  }
});
```

### TODO

[ ] Need build with 2 version, One is normal version for merchant and another one is devloper version for using in company (it can be modify configure).
