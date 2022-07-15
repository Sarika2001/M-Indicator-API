var express    = require("express");
var routes = require('./routes');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
var router = express.Router();
// test route
router.get('/', function(req, res) {
    res.json({ message: 'Welcome to our Trains apis' });
});
//route to handle user registration
router.get('/register',routes.register);
router.post('/login',routes.login)
router.get('/showtrains',routes.trainapi);
router.post('/addtrain',routes.addtrain);
app.use('/', router);
app.listen(4000);