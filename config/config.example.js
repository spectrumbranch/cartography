/*
  Use this file as a template for configuring the 
  HTTP server aspect of the application.

  Rename this file to config.js and update
  the following configuration:
*/

exports.config = {
  hostname: '0.0.0.0',
  port: 8000
};

exports.mailconfig = {
  method: 'sendmail',
  sendmail: {
    bin: '/usr/sbin/sendmail',
	from: '"Cartography Server" <no-reply@something.com>'
  }
};