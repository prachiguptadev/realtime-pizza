const passport = require("passport");
const User = require("../../models/user");
const bcrypt = require("bcrypt");

function authControllers() {
  return {
    login(req, res) {
      res.render("auth/login");
    },
    postLogin(req, res, next) {
      const { email, password } = req.body;
      // Validate request
      if (!email || !password) {
        req.flash("error", "All fields are requiered");
        

        return res.redirect("/login");
      }

      passport.authenticate("local", (err, user, info) => {
        if (err) {
          req.flash("error", info.message);
          return next(err);
        }
        if (!user) {
          req.flash("error", info.message);
          return res.redirect("/login");
        }

        req.logIn(user, (err) => {
          if (err) {
            req.flash("error", info.message);
            return next(err);
          }

          return res.redirect("/");
        });
      })(req,res,next)
    },
    register(req, res) {
      res.render("auth/register");
    },
    async postRegister(req, res) {
      const { name, email, password } = req.body;
      // Validate request
      if (!name || !email || !password) {
        req.flash("error", "All fields are requiered");
        req.flash("name", name);
        req.flash("email", email);

        return res.redirect("/register");
      }

      //  Cheak if email address
      // User.exists({email: email}).select({
      //   if(result) {
      //     req.flash("error", "Email already taken")
      //     req.flash("name", name)
      //     req.flash("email", email)
      //     return res.redirect("/register")

      //   }
      // }).lean()
      User.exists({ email: email }, (err, result) => {
        if (result) {
          req.flash("error", "Email already taken");
          req.flash("name", name);
          req.flash("email", email);
          return res.redirect("/register");
        }
      });
      // Hash paasword
      const hashedPassword = await bcrypt.hash(password, 10);
      // Create a user
      const user = new User({
        name,
        email,
        password: hashedPassword,
      });
      console.log(user);
      user
        .save()
        .then((data) => {
          return res.redirect("/");
          console.log(data);
          // Login
        })
        .catch((err) => {
          req.flash("error", "Something went wrong");
          return res.redirect("/register");
        });
    },
    // logout(req, res) {
    //   req.logout()
    //   return res.redirect("/login")
    // }
  };
}

module.exports = authControllers;
