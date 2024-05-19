/* eslint-disable */

import axios from 'axios';

module.exports = async function () {
   // Configure axios for tests to use.
   const host = process.env.HOST;
   const port = process.env.PORT;
   axios.defaults.baseURL = `http://${host}:${port}`;
};
