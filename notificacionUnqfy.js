const {Observer} = require('./observerPattern');
const rp = require('request-promise');


class NotificacionApiRest {
  constructor(){

    this.route = 'localhost';
    this.port = 8001;//TODO: leerse de algún lado

  }
  options(endpoint,body) {
    return {
      uri: this.generateUrl(endpoint),
      body: (body),
      json: true
    };
  }


  generateUrl(endpoint) {
    return `${this.route}:${this.port}/api/${endpoint} `;
  }


  notificarBajaArtista(anArtist){

    const jsonBody = {
      artistId: 1 ,
      message : 'Baja Artista',
      from: 'unqfy@gmail.com',
      to:'nadie',

    };
    const options = this.options('notify',jsonBody);

    rp.post(options);

  }
  notificarNuevoAlbum(anAlbum){

  }
}


class NotificadorUnqfy extends Observer{

  constructor(){
    super();
    this.apiNotificaciones = new NotificacionApiRest();

  }

  update(caso,data){

    switch (caso){

    case 'Agregar Album':
      this.apiNotificaciones.notificarNuevoAlbum(data);

      break;
    case 'Baja Artista':

      this.apiNotificaciones.notificarBajaArtista(data);
      break;

    }

  }

}

module.exports = {NotificadorUnqfy,NotificacionApiRest};