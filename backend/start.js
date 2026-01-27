// Compatibility script for Render deployment
// Render sometimes defaults to 'node start.js' or users might configure it incorrectly.
// This script redirects to server.js to ensure the backend starts regardless.

console.log('Redirecting start.js to server.js...');
require('./server.js');
