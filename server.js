var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var app = express();
var server = require('http').createServer(app);

var allRoute = require('./server/routes/allRoute');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('port', process.env.PORT || 3000);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
/**
 * 初始化化session
 */
app.use(session({
    secret: '12345',
    name: 'requireSystem',   //这里的name值得是cookie的name，默认cookie的name是：connect.sid
    cookie: {maxAge: 8000000000000},  //设置maxAge是80000ms，即80s后session和相应的cookie失效过期
    resave: false,
    saveUninitialized: true
}));
app.use(express.static(path.join(__dirname, 'public')));

/**
 * 所有页面匹配react-router方法
 */
app.get('/',function (req, res,next) {
    res.render('index')
});
app.get('/index',function (req, res,next) {
    res.render('index')
});
app.get('/main',function (req, res,next) {
    res.render('index')
});
app.get('/publish/index',function (req, res,next) {
	if(req.session.user){
        res.render('index')
    }else{
        res.redirect('/index')
    }

    
});
app.get('/mobile',function (req, res,next) {
    res.render('index')
});
app.get('/main/page',function (req, res,next) {
    res.render('index')
});
app.get('/session',function (req, res,next) {
    if(req.session.user){
        res.send(req.session.user)
    }else{
        res.send('fail')
    }
});

app.use(allRoute);



server.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});

