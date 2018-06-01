let express = require('express');
let app = express();
const fs = require('fs');
const unqmod = require('./unqfy');
//const {isNotUndefined} = require('./funcionesAuxiliares');

let router = express.Router();

let port = process.env.PORT || 8080;

function getUNQfy(filename) {
  let unqfy = new unqmod.UNQfy();
  if (fs.existsSync(filename)) {
    unqfy = unqmod.UNQfy.load(filename);
  }
  return unqfy;
}

function saveUNQfy(unqfy, filename) {
  unqfy.save(filename);
}


router.use(function (req, res, next) {
    console.log('Request received!');
    next();});

router.get('/', function (req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});

function isNotUndefined(value) {
  return value != undefined;
}


function run(params, func) {
return function (req, res) {
  if(params.every(p => isNotUndefined(req.query[p]))) {
        let unqfy = getUNQfy('estado.json');
r=func(unqfy, req.query);
        saveUNQfy(unqfy, 'estado.json');
        res.json(r);
    }else{
        res.json({ status: 400, errorCode: 'BAD_REQUEST'});
} };
}

router.route('/artist').get(run(['id'], function (unqfy, data) {
//unqfy.addArtist(data);
return { message: 'dok' };
}));

router.route('/artist').post(run(['name','country'], function (unqfy, data) {
unqfy.addArtist(data);
return { message: 'oky' };
}));

app.use('/api', router);

app.listen(port);
console.log('Server started at the port: ' + port);