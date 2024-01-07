const app = require('./app');

/**
 * Start the server and listen on the specified port.
 *
 * @param {number} process.env.PORT - The port number specified in the environment variable PORT or default to 3000.
 * @param {function} callback - The callback function to be executed once the server is listening.
 * 
 * @returns {void}
 */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
