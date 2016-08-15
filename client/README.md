### Overall Directory Structure

At a high level, the structure looks roughly like this:

```
client/
  |- src/
  |  |- app/
  |  |  |- <app logic>
  |  |- assets/
  |  |  |- <static files>
  |  |- common/
  |  |  |- <reusable code>
  |  |- less/
  |  |  |- main.less
  |- vendor/
  |  |- bootstrap/
  |- .bowerrc
  |- bower.json
  |- Gruntfile.js
  |- package.json
```

What follows is a brief description of each entry, but most directories contain
their own `README.md` file with additional documentation, so browse around to
learn more.

- `src/` - our application sources.
- `vendor/` - third-party libraries. [Bower](http://bower.io) will install
  packages here. Anything added to this directory will need to be manually added
  to `Gruntfile.js` to be picked up by the build system.
- `.bowerrc` - the Bower configuration file. This tells Bower to install
  components into the `vendor/` directory.
- `bower.json` - this is our project configuration for Bower and it contains the
  list of Bower dependencies we need.
- `Gruntfile.js` - our build script.
- `package.json` - metadata about the app, used by NPM and our build script. Our
  NPM dependencies are listed here.
