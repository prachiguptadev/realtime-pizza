const Order = require("../../models/order");
const moment = require("moment")
function orderController() {
  return {
    store(req, res) {
      // Validate request
      const { phone, address } = req.body;
      if (!phone || !address) {
        req.flash("error", "All field are required");
        return res.redirect("/cart");
      }
      const order = new Order({
        customerId: req.user._id,
        items: req.session.cart.items,
        phone,
        address,
      });
      order
        .save()
        .then((result) => {
          req.flash("sucess", "Order placed sucessfully");
          delete req.session.cart;
          return res.redirect("/customer/orders");
        })
        .catch((err) => {
          req.flash("error", "something went Wrong");
          return res.redirect("/cart");
        });
    },

    async index(req, res) {
      // console.log(req.user);
      const orders = await Order.find({ customerId: req.user._id }, null,{sort:{"createdAt": -1}});
      res.render("customers/orders", { orders: orders, moment: moment });
      // console.log(req.user);
    },
  };
}

module.exports = orderController;
