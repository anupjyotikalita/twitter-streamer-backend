const TwitterController = require("../controllers/twitter.controller");

const TwitterRoutes = (app) => {
    app.post("/rules", TwitterController.searchKeyword);

    app.delete("/rules", TwitterController.deleteRules);
}

module.exports = TwitterRoutes;