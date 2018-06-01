let express = require('express');
let app = express();
const fs = require('fs');
const unqmod = require('./unqfy');
//const {isNotUndefined} = require('./funcionesAuxiliares');
function isNotUndefined(value) {
  return value != undefined;
}


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

// excepciones:
class ApiException extends Error {
  constructor(status, errorCode) {
    super();
    this.status = status
    this.errorCode = errorCode;
} }

class ResourceNotFound extends ApiException  {
  constructor() {
    super(404, "RESOURCE_NOT_FOUND");
} }

class BadRequest extends ApiException  {
  constructor() {
    super(400, "BAD_REQUEST");
} }



router.use(function (req, res, next) {
    console.log('Request received!');
    next();});

router.get('/', function (req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});

function throwException(res, e) {
  res.status(e.status).send(JSON.stringify(e));
}

function run(params, func) {
  return function (req, res) {
    if(params.every(p => isNotUndefined(req.query[p]))) {
        let unqfy = getUNQfy('estado.json');
        try {
          r=func(unqfy, req.query);
        } catch (ApiException) {
          throwException(res, ApiException);
        }
        saveUNQfy(unqfy, 'estado.json');
        res.json(r);
      }else{
        throwException(res, new BadRequest);
} };
}

router.route('/artist').get(run(['id'], function (unqfy, data) {
  try {
    artist = unqfy.getArtistById(data.id);
  } catch (ArtistNotFoundException) {
    throw new ResourceNotFound()
  }
  return JSON.stringify(artist);
}));

router.route('/artist').post(run(['name','country'], function (unqfy, data) {
unqfy.addArtist(data);
artist = unqfy.searchArtistByName(data.name);
return JSON.stringify(artist);
}));

app.use('/api', router);

app.listen(port);
console.log('Server started at the port: ' + port);