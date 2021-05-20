//this requires returns a function (!)
const routes = require("next-routes")();

//define a new route mapping /:wildcardVariable that changes
routes
    .add("/campaigns/new", "/campaigns/new")
    .add('/campaigns/:address', '/campaigns/show');


module.exports = routes;