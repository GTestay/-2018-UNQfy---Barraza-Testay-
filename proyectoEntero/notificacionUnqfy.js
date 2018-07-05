const {Observer} = require('./observerPattern');
const rp = require('request-promise');


class NotificacionApiRest {
  constructor(){
    this.route = 'localhost';
    this.port = process.env.NOTIFICATION_PORT || 8001;
  }
  options(endpoint,body) {
    return {
      uri: this.generateUrl(endpoint),
      body: body,
      json: true
    };
  }


  generateUrl(endpoint) {
    return `${this.route}:${this.port}/api/${endpoint} `;
  }

  generateMail(anArtist,aMessage,aSubject,aFrom){
    return {
      artistId: anArtist.id,
      message: aMessage,
      from: aFrom,
      subject: aSubject,
    };
  }


  notificarBajaArtista(data){
    const jsonBody = 
    this.generateMail(data.artist,
      `Hola,el artista ${data.artist.name} se ha dado de baja`,
      this.unqfy(),
      'Baja Artista'
    );
    
    return  this.notificarMail(jsonBody);
    
  }
  unqfy(){
    return 'UNQfy <UNQfy.notifications@gmail.com>';
  }

  notificarNuevoAlbum(data){
    const jsonBody = 
    this.generateMail(
      data.artist,
      `Hola, el artista ${data.artist.name} tiene un nuevo Album ${data.album.name}`,
      this.unqfy(),
      'Nuevo Album');

    return this.notificarMail(jsonBody);
  }

  notificarMail(jsonBody){
    
    const options = this.options('notify',jsonBody);
    return rp.post(options).then().catch(err=> console.err(err));

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
      //this.apiNotificaciones.notificarNuevoAlbum(data);

      break;
    case 'Baja Artista':

      //this.apiNotificaciones.notificarBajaArtista(data);
      break;
    }
  }
}

module.exports = {NotificadorUnqfy,NotificacionApiRest};