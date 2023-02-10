const express = require('express');
const router = express.Router();
const conf=require('config');
var session = require('express-session');
const axios = require("axios");
const { route } = require('./callback');
router.use(session({
    secret: `${conf.cookie_secret}`,
    resave: false,
    saveUninitialized: false
}));
async function postData(apiURL,data){    
 let values = await axios.post(apiURL,data)
 return(values);
}
async function getData(apiURL){    
    let values = await axios.get(apiURL)
     return(values);
   }
router.get('/', (req, res) => {
    if (req.session.token != undefined){login=true;}else{login=false;}
    res.render('user-index',{login,AppName:conf.AppName});
});
router.get('/:userName@:Instance', (req, res) => {
 const User = req.params.userName;
 const Instance = req.params.Instance

 if (req.session.token != undefined){login=true;}else{login=false;};
 const url = `https://${Instance}/.well-known/nodeinfo`;
 getData(url).then((values) => {
    getData(values.data.links[0].href).then((values) => {
     if(values.data.software.name == "misskey"){
        postData(`https://${Instance}/api/users/search`,{query:`${User}`,origin:"local",limit:1}).then((values) => {
            res.render('user-prof',{login,AppName:conf.AppName,userData:values.data[0],host:Instance});
           }).catch((err) => {
            console.log("なんかしらのエラー　",err)
           });
     }else{
       res.render('user-err',{AppName:conf.AppName});
     };
    });
   }).catch((err) => {
   
       res.render('user-err',{AppName:conf.AppName});
       
   });





});






router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('致命的なエラーかも \n 原因不明っぽいので修正に時間がかかるかも.... \n どういうことをしたらこういう風になったのか開発者に教えてほしいかも..?');
   });

module.exports = router;