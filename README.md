<img src="https://raw.github.com/spectrumbranch/cartography/master/images/cartography.png" />

cartography
===========

A 2D tile based map editor.

Installation
============
Clone the latest:
```git clone git@github.com:spectrumbranch/cartography.git```
```cd cartography```
Install the application's dependencies:
```npm install .```
Setup configuration files:
```cp ./config/database.example.js ./config/database.js```
```cp ./config/config.example.js ./config/config.js```

Make sure sendmail is installed if you wish to have email working.
Set up the database connection config in ./config/database.js. As of right now, mysql is the only supported database setup. Make sure the credentials are correct as to avoid crashing. The database needs to be created in advanced.
```
exports.config = {
  type: 'mysql',
  hostname: 'localhost',
  port: 3306,
  db: 'mydbname',
  user: 'dbuser',
  password: 'dbpass'
};
```
Set up the HTTP server, mail, and tls config in ./config/config.js. The following is customizable:
```
exports.config = {
  hostname: '0.0.0.0',
  port: 8000,
  tls: false
};

exports.mailconfig = {
  method: 'sendmail',
  sendmail: {
    bin: '/usr/sbin/sendmail',
	from: '"Cartography Server" <no-reply@something.com>'
  }
};

//If exports.config.tls == true, then the following tlsconfig is required to be uncommneted and filled out properly.
//Keep this commented out if exports.config.tls == false
//var fs = require('fs');
//exports.tlsconfig = {
//  key: fs.readFileSync('/somewhere/fixtures/keys/cartography-key.pem'),
//  cert: fs.readFileSync('/somewhere/fixtures/keys/cartography-cert.pem')
//}
```

Run with ```node .``` and enjoy!

Tileset API Reference
=============

See [Tileset API reference](/docs/Reference.md)

How to run tests
================
In a browser, navigate to the ```test/``` directory. All tests included will run and report in-browser.

Acknowledgments
===============
Logo created by Ashley Fairweather - http://starforsaken101.deviantart.com