# Lucy Live [![Build Status](https://travis-ci.org/lucidogen/lucy-live.svg)](https://travis-ci.org/lucidogen/lucy-live)


## Installation

Currently only works with [**io.js**](https://iojs.org).

  ```shell
  npm install lucidogen/lucy-live --save
  ```

## Live coding support for nodejs

lucy.live helps live coding with Javascript by watching files for changes and
providing a mechanism to trigger hooks when needed.

Usage example:

```js
  const live = require ( 'lucy-live' )

  // expects foo.js library to return "obj"
  live.load
  ( 'foo.js'
  , function ( obj )
    {
      console.log ( 'foo changed: ' + obj )
    }
  )

  live.path
  ( 'image.jpg'
  , function ( imgPath )
    { // do something with new image taking
      // care of Browser cache
    }
  )

  // Start listening for changes in '.'
  live.watch ( '.' )
```


## Tests

  ```shell
   npm test
  ```

## Contributing

Please use ['jessy style'](http://github.com/lucidogen/jessy).

Add unit tests for any new or changed functionality.

## Release History

  * 0.1.0 Initial release
