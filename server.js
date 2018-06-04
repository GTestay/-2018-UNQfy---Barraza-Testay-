const express = require('express');
const app = express();
const fs = require('fs');
const bodyParser = require('body-parser');
const {BadRequest, Failure, ResourceAlreadyExistError, ResourceNotFound} = require('./Excepciones');
const unqmod = require('./unqfy');
const {isNotUndefined} = require('./funcionesAuxiliares');

const router = express.Router();

const port = process.env.PORT || 5000;

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

router.use((req, res, next) => {
    console.log('Request received!');
    next();
});

router.get('/', (req, res) => {
    res.json({message: 'hooray! welcome to our api!'});
});

function throwException(res, e) {
  res.status(e.status).send(JSON.stringify(e));
}

function run(params, func) {
  return function (req, res) {
    if(params.every(p => isNotUndefined(req.query[p]))) {
        let unqfy = getUNQfy('estado.json');
        try {
          r=func(unqfy, req);
        } catch (ApiException) {
          throwException(res, ApiException);
        }
        saveUNQfy(unqfy, 'estado.json');
        res.json(r);
      }else{
        throwException(res, new BadRequest);
} };
}

router.route('/artist/:id').get(run([], function (unqfy, req) {
  try {
    artist = unqfy.getArtistById(req.params.id);
  } catch (ArtistNotFoundException) {
    throw new ResourceNotFound()
  }
  return JSON.stringify(artist);
}));

router.route('/artist').post(run(['name','country'], function (unqfy, data) {
artist = unqfy.addArtist(data);
return JSON.stringify(artist);
}));

router.route('/artist').delete(run(['id'], (unqfy, data) => {

    let artist;
    try {
        artist = unqfy.getArtistById(data.id);
    } catch (ArtistNotFoundException) {
        throw new ResourceNotFound();
    }
    unqfy.removeArtist(artist.name);
    return JSON.stringify(artist);
}));

app.use('/api', router);


app.listen(port);
console.log('Server started at the port: ' + port);