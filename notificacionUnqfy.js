const {Observer} = require('./observerPattern');

class ApiNotification {

  notificarBajaArtista(anArtist){

  }
  notificarNuevoAlbum(anAlbum){

  }
}

class ApiNotificationStateless extends ApiNotification{

  constructor(){
    super();
    this.notificacionesEnviadas = 0;
  }
  notificarNuevoAlbum(anAlbum){
    console.log('Un nuevo album es notificado ');
    this.notificacionesEnviadas ++;
  }

  notificarBajaArtista(anArtist){
    console.log('Un artista se dio de Baja ');
    this.notificacionesEnviadas ++;

  }

}

class NotificadorUnqfy extends Observer{

  constructor(apiNotificaciones){
    super();
    this.apiNotificaciones = apiNotificaciones || new ApiNotificationStateless();

  }

  update(nuevoAlbum){
    this.apiNotificaciones.notificarNuevoAlbum(nuevoAlbum);
  }

  removeArtistSubscription(artist){
    this.apiNotificaciones.notificarBajaArtista(artist);
  }

}

module.exports = {
  NotificadorUnqfy,ApiNotificationStateless,ApiNotification
};