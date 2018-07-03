const express = require('express');
const app = express();
const fs = require('fs');
const bodyParser = require('body-parser');
const {BadRequest, Failure, ResourceAlreadyExistError, ResourceNotFound, RelatedResourceNotFound, APIError} = require('./Excepciones');
const {isNotUndefined} = require('./funcionesAuxiliares');
const {Notificador} = require('./notificador');
const rp = require('request-promise');


const router = express.Router();

const port = 8001;



class ApiUnqfy {
  constructor(){
    this.route = 'http://localhost';
    this.port = 8000;//TODO: leerse de algún lado

  }
  options(endpoint) {
    return {
      uri: this.generateUrl(endpoint),
      json: true
    };
  }


  generateUrl(endpoint) {
    return `${this.route}:${this.port}/api/${endpoint} `;
  }

  artistExist(artistId){
    const options = this.options(`artists/${artistId}`);
    console.log('Buscando Artista');

    return rp.get(options).then(artist=>{
      console.log('ACERTO');
      console.log(artist);
      return true;
    })
      .catch(response =>{
        console.log('ERROR');
        const err = response.error;
        if(err.statusCode === 402){
          throw new ResourceNotFound();
        }
      });
  }

}


function levantarNotificador(filename) {
  let notificador = null;
  if (fs.existsSync(filename)) {
    notificador = Notificador.load(filename);
  } else {
    notificador = new Notificador();

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

      const notificador = levantarNotificador('notificador.json');
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

function existArtist(artistId) {
  const unqfy = new ApiUnqfy();

  return unqfy.artistExist(artistId);

}


//POST /api/subscribe body = ["artistId","email"];
router.route('/subscribe').post(run(['artistId','email'], (notificador, req) => {

  console.log('hacer algo');
  existArtist(req.body.artistId).then(asd =>{
    console.log('registrar mail');

    notificador.subscribe(req.body.email, req.body.artistId);

  }).then(not =>
    guardarNotificador(notificador, 'notificador.json')
  );

}));

//POST /api/unsubscribe  body = ["artistId","email"];
router.route('/unsubscribe').post(run(['artistId','email'], (notificador, req) => {

  existArtist(req.body.artistId).then(

    notificador.unsubscribe(req.body.artistId,req.body.email)

  ).then(not =>
    guardarNotificador(notificador, 'notificador.json')
  );


}));

//POST /api/notify
// "artistId":
// "subject": "Nuevo Album para artsta Chano",
// "message": "Se ha agregado el album XXX al artista Chano",
// "from": "UNQfy <UNQfy.notifications@gmail.com>",
router.route('/notify').post(run(['artistId','subject','message','from'], (notificador, req) => {

  existArtist(req.body.artistId).then(

    notificador.notify(req.body.artistId,req.body.subject,req.body.message,req.body.from)

  ).then(not =>
    guardarNotificador(notificador, 'notificador.json')
  );
}));

//GET /api/subscriptions/id
// "subscriptors": [<email1>, <email2>]
router.route('/subscriptions/:id').get(run([], (notificador, req) => {

  return notificador.subscriptions(req.params.id);
}));

//DELETE /api/subscriptions body "artistId": <artistID>,
router.route('/subscriptions').delete(run(['artistId'], (notificador, req) => {

  existArtist(req.body.artistId).then(

    notificador.removeArtist(req.body.artistId)

  ).then(not =>
    guardarNotificador(notificador, 'notificador.json')
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

/**
router.use('/', (req, res) => {
  throwException(res, new ResourceNotFound);
});
*/
app.use(bodyParser.json());
app.use('/api', router);
app.use(errorHandler);
app.listen(port);

console.log('Server started at the port: ' + port);
