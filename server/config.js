var path = require('path');

module.exports = {
  server: {
    listenPort: 3000,                                   		// The port on which the server is to listen (means that the app is at http://localhost:3000 for instance)
    publicFolder: path.resolve(__dirname, '../client/public'),  // The folder that contains the application files (note that the files are in a different repository) - relative to this file
    apiV1Url: '/api/v1',                                		// The base url from which we serve API v1 resources
    cookieSecret: 'flight-search'                         		// The secret for encrypting the cookie
  }
};