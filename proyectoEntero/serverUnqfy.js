const express = require('express');
const app = express();
const fs = require('fs');
const bodyParser = require('body-parser');
const {BadRequest, Failure, ResourceAlreadyExistError, ResourceNotFound, RelatedResourceNotFound, APIError} = require('./Excepciones');
const unqmod = require('../unqfy/main');
const {isNotUndefined} = require('./funcionesAuxiliares');
const {NotificacionApiRest,NotificadorUnqfy}= require('./notificacionUnqfy');
require('dotenv').config();

const router = express.Router();

const port = process.env.UNQFY_PORT || 8000;

function observar(unqfy){
  unqfy.addObserver(new NotificadorUnqfy());
}

function getUNQfy(filename) {
  let unqfy = new unqmod.UNQfy();
  if (fs.existsSync(filename)) {
    unqfy = unqmod.UNQfy.load(filename);
  }
  // observar(unqfy);
  console.log('Cargar');
  return unqfy;
}

function saveUNQfy(unqfy, filename) {
  unqfy.save(filename);
  console.log('Salvando');

}


function throwException(res, e) {
  res.status(e.status).send(e);
}

function errorHandler(err, req, res, next) {
  console.error(err);
  if (err instanceof APIError) {
    res.status(err.status);
    res.json(err);
  } else if (err.type === 'entity.parse.failed') {
    res.status(err.status);
    res.json(new BadRequest());
  } else {
    next(err);
  }
}

function run(params, func) {
  return function (req, res) {
    if (params.every(p => isNotUndefined(req.query[p]) || isNotUndefined(req.body[p]))) {
      const unqfy = getUNQfy('estado.json');
      const respuesta = func(unqfy, req);
      saveUNQfy(unqfy, 'estado.json');
      res.json(respuesta);
    } else {
      throw new BadRequest;
    }
  };
}

// get/api/artist/:id
router.route('/artists/:id').get(run([], (unqfy, req) => {
  let artist = undefined;
  try {
    artist = unqfy.getArtistById(req.params.id);
  } catch (ArtistNotFoundException) {
    throw new ResourceNotFound();
  }
  return artist.toJSON();
}));

// get /api/artists?name=x
router.route('/artists').get(run([], (unqfy, req) => {

  if (isNotUndefined(req.query.name)) {
    return unqfy.searchArtistByName(req.query.name);
  } else {
    return unqfy.artists;
  }
}));


// post/api/artist body=(name, country)
router.route('/artists').post(run(['name', 'country'], (unqfy, req) => {

  if (unqfy.existArtist(req.body.name)) {
    throw new ResourceAlreadyExistError();
  } else {
    return unqfy.addArtist(req.body);
  }

}));

// delete /artists/:id
router.route('/artists/:id').delete(run([], (unqfy, req) => {

  let artist;
  try {
    artist = unqfy.getArtistById(req.params.id);
  } catch (ArtistNotFoundException) {
    throw new ResourceNotFound();
  }
  unqfy.removeArtist(artist.name);

}));


// get /api/albums/:id
router.route('/albums/:id').get(run([], (unqfy, req) => {
  let album;
  try {
    album = unqfy.getAlbumById(req.params.id);
  } catch (AlbumNotFoundException) {
    throw new ResourceNotFound();
  }
  return album;
}));

// get /api/albums?name=x
router.route('/albums').get(run([], (unqfy, req) => {

  if (isNotUndefined(req.query.name)) {
    return unqfy.searchAlbumByName(req.query.name);
  } else {
    return unqfy.allAlbums();
  }
}));

function addAlbumnToArtist(unqfy, artist, req) {

  if (!artist.hasThisAlbum(req.body.name)) {
    return unqfy.addAlbumToArtist(artist, req.body);
  } else {
    throw new ResourceAlreadyExistError();
  }
}

// post /api/albums
router.route('/albums').post(run(['artistId', 'name', 'year'], (unqfy, req) => {

  let artist;
  try {
    artist = unqfy.getArtistById(req.body.artistId);
  } catch (ArtistNotFoundException) {
    throw new RelatedResourceNotFound();
  }
  return addAlbumnToArtist(unqfy, artist, req);
}));



// delete /albums/:id
router.route('/albums/:id').delete(run([], (unqfy, req) => {

  let album;
  try {
    album = unqfy.getAlbumById(req.params.id);
  } catch (AlbumNotFoundException) {
    throw new ResourceNotFound();
  }
  unqfy.removeAlbum(album.name);

}));

router.use('/', (req, res) => {
  throwException(res, new ResourceNotFound);
});


app.use(bodyParser.json());
app.use('/api', router);
app.use(errorHandler);
app.listen(port);

console.log('Server started at the port: ' + port);
