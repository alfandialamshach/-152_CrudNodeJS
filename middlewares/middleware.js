// Middlewareuntuk memeriksa autentifikasi
function isAuthenticated(req, res, next) {  
    if (req.session.userId) {
        return next();
    } else {
    res.redirect('/login');  
    }
}

module.exports = {isAuthenticated};
