const authControllers = require("../app/http/controllers/authControllers");
const cartControllers = require("../app/http/controllers/customers/cartControllers");
const homeController = require("../app/http/controllers/homeController");
const guest = require("../app/http/middleware/guest");

function initRoutes(app) {
  app.get("/", homeController().index);


  app.get("/login", guest , authControllers().login);

  app.post("/login", authControllers().postLogin);


  app.get("/register", guest , authControllers().register);
  // app.post("/logout", authControllers().logout);

  app.post('/logout', function(req, res, next){
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/login');
    });
  });


  app.get("/cart", cartControllers().index);
  app.post("/update-cart", cartControllers().update);

}

module.exports = initRoutes;
