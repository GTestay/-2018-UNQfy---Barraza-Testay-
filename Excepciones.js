'use strict';

class NotFoundException extends Error {
  constructor(unNombre) {
    super();
    this.message = `${this.objetoNoEncontrado()} ${unNombre} no fue encontrado`;
  }

  objetoNoEncontrado() {
    return ' ';
  }
}


class ArtistNotFoundException extends NotFoundException {
  objetoNoEncontrado() {
    return 'Artista';
  }
}

class AlbumNotFoundException extends NotFoundException {

  objetoNoEncontrado() {
    return 'Album';
  }
}


class TrackNotFoundException extends NotFoundException {

  objetoNoEncontrado() {
    return 'Track';
  }
}


module.exports = {
  ArtistNotFoundException, AlbumNotFoundException, TrackNotFoundException
};