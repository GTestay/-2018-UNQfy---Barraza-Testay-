const {Observer} = require('./observerPattern');
const rp = require('request-promise');
require('dotenv').config();


class NotificacionApiRest {
  constructor() {
    this.route = process.env.NOTIFICATION_ROUTE || 'http://localhost';
    this.port = process.env.NOTIFICATION_PORT || 8001;
  }


  unqfy() {
    return 'UNQfy <UNQfy.notifications@gmail.com>';
  }

  options(endpoint, body) {
    return {
      uri: this.generateUrl(endpoint),
      body: body,
      json: true
    };
  }

  generateUrl(endpoint) {
    return `${this.route}:${this.port}/api/${endpoint} `;
  }

  generateMail(anArtist, aMessage, aSubject, aFrom) {
    return {
      artistId: anArtist.id,
      message: aMessage,
      from: aFrom,
      subject: aSubject,
    };
  }


  notificarBajaArtista(caso, data) {

    this.borrarArtista(data.artist);

  }

  notificarNuevoAlbum(caso, data) {
    const jsonBody =
      this.generateMail(
        data.artist,
        `Hola, el artista ${data.artist.name} tiene un nuevo Album ${data.album.name}`,
        this.unqfy(),
        caso);

    this.notificarMail(jsonBody);
  }


  notificarMail(jsonBody) {

    const options = this.options('notify', jsonBody);
    return rp.post(options)
      .then(good => console.log('mail enviado :D'))
      .catch(err => console.error(err.status));
  }

  borrarArtista(artist) {
    const jsonBody = {artistId: artist.id};

    const options = this.options('subscriptions', jsonBody);
    return rp.delete(options)
      .then(good => console.log('borrado enviado! '))
      .catch(err => console.error(err.status));
  }
}


class NotificadorUnqfy extends Observer {

  constructor() {
    super();
  }

  update(caso, data) {
    const api = new NotificacionApiRest();
    switch (caso) {

    case 'Agregar Album':
      console.log(`Se agrego ${data.album.name} a ${data.artist.name}, notificando`);
      api.notificarNuevoAlbum(caso, data);

      break;
    case 'Baja Artista':
      console.log(`Se da de baja a  ${data.artist.name}, notificando`);
      api.notificarBajaArtista(caso, data);
      break;
    }
  }
}

module.exports = {NotificadorUnqfy, NotificacionApiRest};