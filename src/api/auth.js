let router = require("express").Router();


// req.isAuthenticated is provided from the auth router
router.get('/profile', (req, res) => {
    if (req.oidc.isAuthenticated()) {
        res.json({
            success: true,
            user: req.oidc.user
        })
    } else {
        res.json({
            success: false,
            status: "Logged out!"
        })
    }
});
module.exports = router;