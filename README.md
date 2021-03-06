# Lucy Live [![Build Status](https://travis-ci.org/lucidogen/lucy-live.svg)](https://travis-ci.org/lucidogen/lucy-live)

Part of [lucidity](http://lucidity.io) project.

## Live coding support for node.js

Replace `require` by `live.require` to update the required code or assets as the
source file changes.

## Installation

  ```sh
  npm install lucy-live --save
  ```

## Usage example

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

The module definition needs to take into account that it may be reloaded by
reusing `module.exports` and updating it. Simply exporting a new module will not
work because the newly created module will not be linked to existing objects.

Example of a module exporting a simple Person class where methods are live
coded. The code shown here is just one way to implement this behaviour. The only
thing to notice is that `loaded` is false on first load and true on reload:

  ```js
  // Person.js

  if ( ! exports.loaded )
  { // Initial code loading is used to create a simple function wrapping a call
    // to an initialize method.
    module.exports = function ()
    { this.init.apply ( arguments )
    }
  }
  // Code from here is executed on every file change.
  const Person = module.exports.prototype

  Person.init = function ( name )
  { this._name = name
  }

  Person.sayHello = function ()
  { console.log ( `Hello, I am ${ this._name }.` )
  }
  ```

  Person usage:

  ```js
  const live   = require ( 'lucy-live' )
  const Person = live.require ( './Person' )

  let o = new Person ( 'Georg Groddeck' )
  o.sayHello ()

  setTimeout
  ( function ()
    { o.sayHello () // will call the updated 'sayHello' method
    }               // when Person.js is changed
  , 2
  )

  // To only call a method when the file is loaded (always called at least once)
  // one can use live.path:
  live.path
  ( './Person'
  , function ( path )
    { console.log ( `Path '${ path }' changed.` )
      o.sayHello ()
    }
  )

  // Start watching for changes in this file's directory.
  live.watch ( '.' )
  ```

Real world example of GLSL shader live coding (taken from
[Lucidity](http://lucidity.io).

  ```js
  const ShaderEffect = require ( 'lucy-compose' ).ShaderEffect
  const THREE = require ( 'three' )
  const live  = require ( 'lucy-live' )

  if (!exports.loaded) {
    // On first load, we create the effect
    module.exports = new ShaderEffect
  }
  const self = module.exports

  // We simply update the shaders when the glsl files change.

  live.read
  ( './vert.glsl'
  , function ( s )
    { self.material.vertexShader = s
      self.material.needsUpdate  = true
    }
  )

  live.read
  ( './frag.glsl'
  , function ( s )
    { self.material.fragmentShader = s
     self.material.needsUpdate    = true
    }
  )

  // We could customize a method like this:
  self.render = function ( context, target )
  {
    // ...
  }
  
  ```


## Tests

  ```sh
  npm test
  ```

## Contributing

Please use ['jessy style'](http://github.com/lucidogen/jessy).

Add unit tests for any new or changed functionality.

## Release History

  * 0.1.3 (2015-09-22) Better documentation.
  * 0.1.2 (2015-09-22) Compatible with latest version of node.js.
  * 0.1.1 (2015-09-02) NPM readme fix.
  * 0.1.0 (2015-09-02) Initial release.
