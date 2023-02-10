const express = require('express');
const router = express.Router();
const conf=require('config');
const axios = require("axios");
var session = require('express-session');
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

router.get('/prof', (req, res) => {
    const token = req.session.token;
    const instance = req.session.instance;

    if (token == undefined){
     res.redirect('/login');
    }else{
        postData(`${instance}api/i`,{i:token}).then((values) => {
            host = new URL(instance).host;
            res.render('user-prof',{login,AppName:conf.AppName,userData:values.data,host});
        }).catch((err) => {
            console.log("なんかしらのエラー　",err)
        });
}});

router.get('/user/:userName@:Instance', (req, res) => {
    const User = req.params.userName;
    const Instance = req.params.Instance
    const token = req.session.token;
    const url = `https://${Instance}/.well-known/nodeinfo`;
    const myInstance = req.session.instance;
    if (req.session.token != undefined){login=true;
        getData(url).then((values) => {
            getData(values.data.links[0].href).then((values) => {
                if(values.data.software.name == "misskey"){
                    host = new URL(myInstance).host;
                    if(host == Instance){
                        postData(`https://${Instance}/api/users/search`,{i:`${token}`,query:`${User}`,origin:"local",limit:1}).then((values) => {
                            res.render('user-prof',{login,AppName:conf.AppName,userData:values.data[0],host:Instance});
                           }).catch((err) => {
                            console.log("なんかしらのエラー　",err)
                           });
                        }else{
                            
                        }
                }else{
                  res.render('user-err',{AppName:conf.AppName});
                };
               });
           }).catch((err) => {
               res.render('user-err',{AppName:conf.AppName});
           });
    
    
    
    }else{login=false; res.redirect('/login');};

   
   });
router.use((err, req, res, next) => {
 console.error(err.stack);
 res.status(500).send('致命的なエラーかも \n 原因不明っぽいので修正に時間がかかるかも.... \n どういうことをしたらこういう風になったのか開発者に教えてほしいかも..?');
});

module.exports = router;