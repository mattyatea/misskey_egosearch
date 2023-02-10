var express = require('express');
var app = express();
const conf=require('config');
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

process.on('uncaughtException', function(err) {
 console.log("どこかでつまずいたよ "+ err +" らしい");
});

app.use('/resource', express.static('public'));

app.use('/', require('./router/index'));

app.use('/login', require('./router/login'));

app.use('/logout', require('./router/logout'));

app.use('/callback', require('./router/callback'));

app.use('/my', require('./router/my'));

app.use('/user', require('./router/user'));




app.use((err, req, res, next) => {
 console.error(err.stack)
 res.status(500).send('Something broke!')
})

app.listen(conf.port);
console.log(`${conf.port}`)