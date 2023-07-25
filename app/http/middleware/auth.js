// function auth(res, req, next) {
//     if(next(req.isAuthenticated())) {
//         console.log(req.isAuthenticated)
//         // return next()
//     }
//     return res.redirect("/login")
// }



function auth(req , res , next){
    if(req.isAuthenticated()){
        return next();
    } else{
        res.redirect("/login");
    }
}
module.exports = auth;