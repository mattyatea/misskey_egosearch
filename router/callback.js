const conf=require('config');
const express = require('express');
const router = express.Router();
var session = require('express-session');
const axios = require("axios");

async function postData(apiURL){    
 let values = await axios.post(apiURL,{headers: {"Content-Type": "application/json", Accept: "application/json", }})
 return(values);
}

router.use(session({
    secret: `${conf.cookie_secret}`,
    resave: false,
    saveUninitialized: false
}));

router.get('/', (req, res) => {
 const referer = req.headers.referer;
 const sessionkey = req.query.session;
 postData(`${referer}api/miauth/${sessionkey}/check`).then((values) => {

 if(values.data.ok==true){
  req.session.instance = referer;
  req.session.token = values.data.token ;

  res.redirect('/');
 }else{
  res.send("error");
 }
 });
});
router.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('致命的なエラーかも \n 原因不明っぽいので修正に時間がかかるかも.... \n どういうことをしたらこういう風になったのか開発者に教えてほしいかも..?');
 });

module.exports = router;