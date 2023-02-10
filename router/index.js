const express = require('express');
const router = express.Router();
const conf=require('config');
var session = require('express-session');
router.use(session({
    secret: `${conf.cookie_secret}`,
    resave: false,
    saveUninitialized: false
}));

router.get('/', (req, res) => {
    if (req.session.token != undefined){login=true;}else{login=false;}
    res.render('index',{login,AppName:conf.AppName});
});

router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('致命的なエラーかも \n 原因不明っぽいので修正に時間がかかるかも.... \n どういうことをしたらこういう風になったのか開発者に教えてほしいかも..?');
   });

module.exports = router;