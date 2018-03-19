const routes = require("next-routes")(); // routes() wird sofort ausgeführt

// Custom Routes festlegen
routes
  .add("/campaigns/new", "./campaigns/new")
  .add("/campaigns/:address", "./campaigns/show");

module.exports = routes;
