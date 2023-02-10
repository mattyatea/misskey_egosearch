const express = require('express');
const router = express.Router();
const axios = require("axios");
const conf=require('config');
const crypto = require("crypto");
var session = require('express-session');

async function getData(apiURL){    
 let values = await axios.get(apiURL)
  return(values);
}

router.use(session({
    secret: `${conf.cookie_secret}`,
    resave: false,
    saveUninitialized: false
}));

router.get('/', (req, res) => {
 if (req.session.token != undefined){login=true;}else{login=false;}
    res.render('login',{login,AppName:conf.AppName});
});

router.post('/', (req, res) => {
 var values = "error"
 const host=req.body.instance;
 const url = `https://${host}/.well-known/nodeinfo`;
getData(url).then((values) => {
 getData(values.data.links[0].href).then((values) => {
  if(values.data.software.name == "misskey"){
   uuid=crypto.randomUUID();
   redirecturl = `https://${host}/miauth/${uuid}?name=egoskey&callback=${conf.url}:${conf.port}/callback&permission=write:notes,write:following,read:drive`
   res.redirect(redirecturl);
  }else{
    res.render('login-err',{AppName:conf.AppName});
  };
 });
}).catch((err) => {

    res.render('login-err',{AppName:conf.AppName});
    
});

});

router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('致命的なエラーかも \n 原因不明っぽいので修正に時間がかかるかも.... \n どういうことをしたらこういう風になったのか開発者に教えてほしいかも..?');
   });
module.exports = router;