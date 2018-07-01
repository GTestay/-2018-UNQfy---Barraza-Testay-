const express = require('express');
const app = express();
const fs = require('fs');
const bodyParser = require('body-parser');
const {BadRequest, Failure, ResourceAlreadyExistError, ResourceNotFound, RelatedResourceNotFound, APIError} = require('./Excepciones');
const {isNotUndefined} = require('./funcionesAuxiliares');
const Notificador = require('./notificador');

const router = express.Router();

const port = 5001;


function levantarNotificador(filename) {
  let notificador = null;
  if (fs.existsSync(filename)) {
    notificador = Notificador.load(filename);
  } else {
    notificador = new Notificador;

  }
  console.log('Cargar');
  return notificador;
}

function guardarNotificador(notificador, filename) {
  notificador.save(filename);
  console.log('Salvando');
}


function validateParams(params, req) {
  return params.every(p => isNotUndefined(req.query[p]) || isNotUndefined(req.body[p]));
}

//funcion para validar datos que llegan.
function run(params, func) {
  return function (req, res) {
    if (validateParams(params, req)) {
      const notificador = levantarNotificador('estado.json');
      const respuesta = func(notificador, req);
      res.json(respuesta);
    } else {
      throw new BadRequest;
    }
  };
}


/**
 * Endpoints
 * */
router.use('/', (req, res) => {
  throwException(res, new ResourceNotFound);
});

//POST /api/subscribe body = ["artistId","email"];
router.route('/subscribe').get(run(['artistId','email'], (notificador, req) => {

  notificador.subscribe(req.body.email, req.body.artistId).then(not =>
    guardarNotificador(not, 'estado.json')
  );

}));

//POST /api/unsubscribe  body = ["artistId","email"];
router.route('/unsubscribe').get(run(['artistId','email'], (notificador, req) => {

  notificador.unsubscribe(req.body.email, req.body.artistId).then(not =>
    guardarNotificador(not, 'estado.json')
  );;
}));

//POST /api/notify
// "artistId":
// "subject": "Nuevo Album para artsta Chano",
// "message": "Se ha agregado el album XXX al artista Chano",
// "from": "UNQfy <UNQfy.notifications@gmail.com>",
router.route('/notify').get(run([], (notificador, req) => {

  guardarNotificador(notificador, 'estado.json').then(not =>
    guardarNotificador(not, 'estado.json')
  );
}));

//GET /api/subscriptions
//response
// "artistId": <artistID>,
// "subscriptors": [<email1>, <email2>]
router.route('/subscriptions').get(run(['artistId'], (notificador, req) => {

  return notificador.subscriptions(req.body.artistId);
}));

//DELETE /api/subscriptions body "artistId": <artistID>,
router.route('/subscriptions').get(run(['artistId'], (notificador, req) => {

  throw new Failure;

  notificador.removeArtist(req.body.artistId).then(not =>
    guardarNotificador(not, 'estado.json')
  );
}));


function throwException(res, e) {
  res.status(e.status).send(e);
}

function errorHandler(err, req, res, next) {
  console.error(err.name);
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

app.use(bodyParser.json());
app.use('/api', router);
app.use(errorHandler);
app.listen(port);

console.log('Server started at the port: ' + port);
