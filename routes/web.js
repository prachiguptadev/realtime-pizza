const authControllers = require("../app/http/controllers/authControllers");
const cartControllers = require("../app/http/controllers/customers/cartControllers");
const homeController = require("../app/http/controllers/homeController");
const orderController = require("../app/http/controllers/orderController")
const guest = require("../app/http/middleware/guest");
const auth = require("../app/http/middleware/auth")
const AdminOrderController  = require('../app/http/controllers/admin/orderController')

function initRoutes(app) {
  app.get("/", homeController().index);


  app.get("/login", guest , authControllers().login);

  app.post("/login", authControllers().postLogin);


  app.get("/register", guest , authControllers().register);
  app.post("/register", authControllers().postRegister);

  // app.post("/logout", authControllers().logout);

  app.post('/logout', function(req, res, next){
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/login');
    });
  });


  app.get("/cart", cartControllers().index);
  app.post("/update-cart", cartControllers().update);

  app.post("/orders", orderController().store)

  // customer routes
  app.post("/orders", auth, orderController().store)
  app.get('/customer/orders', auth ,orderController().index)

  // Admin routes
  app.get("/admin/orders", auth, AdminOrderController().index)

}

module.exports = initRoutes;
