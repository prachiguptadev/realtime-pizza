function guest(req,res,next){
    // console.log(req.user)
    if(!req.isAuthenticated()){
    console.log(req.user)

        return next();
    }
    // console.log(req.user)

    return res.redirect('/')
}

module.exports = guest;