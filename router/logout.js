
var express = require("express");
const router = express.Router();
const session = require('express-session');
const conf=require('config');
router.use(session({
    secret: `${conf.cookie_secret}`,
    resave: false,
    saveUninitialized: false
  }))
  ver=conf.name;
    router.get("/", function(req, res) {
        
        req.session.destroy();

        res.redirect("/");
    });
    


module.exports = router;