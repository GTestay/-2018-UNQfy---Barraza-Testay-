
const picklejs = require('picklejs');

class UNQfy {
  constructor() {
    this.artist = [];
    this.albums = [];
    this.playlist = [];
  }

  getTracksMatchingGenres(genres) {
    // Debe retornar todos los tracks que contengan alguno de los generos en el parametro genres

  }

  getTracksMatchingArtist(artistName) {

  }


  /* Debe soportar al menos:
     params.name (string)
     params.country (string)
  */
  addArtist(params) {
    // El objeto artista creado debe soportar (al menos) las propiedades name (string) y country (string)
    let newArtist = new Artist(params.name, params.country);
    this.artist.push(newArtist);

  }


  /* Debe soportar al menos:
      params.name (string)
      params.year (number)
  */
  addAlbum(artistName, params) {
    // El objeto album creado debe tener (al menos) las propiedades name (string) y year
    let artist = this.getArtistByName(artistName);
    const newAlbum = new Album(artist, params.name, params.year);
    console.log(newAlbum);
    this.albums.push(newAlbum);
  }


  /* Debe soportar (al menos):
       params.name (string)
       params.duration (number)
       params.genres (lista de strings)
  */
  addTrack(albumName, params) {
    /* El objeto track creado debe soportar (al menos) las propiedades:
         name (string),
         duration (number),
         genres (lista de strings)
    */
    let albumSearched = this.getAlbumByName(albumName);
    let newTrack = new Track(params.name, params.duration, params.genres, albumSearched);
    albumSearched.addTrack(newTrack);
  }

  getArtistByName(name) {
    return this.artist.find(artist => artist.name == name);
  }

  getAlbumByName(name) {
    return this.albums.find(album => album.name == name);

  }

  getTrackByName(name) {

  }

  getPlaylistByName(name) {

  }

  addPlaylist(name, genresToInclude, maxDuration) {
    /* El objeto playlist creado debe soportar (al menos):
      * una propiedad name (string)
      * un metodo duration() que retorne la duración de la playlist.
      * un metodo hasTrack(aTrack) que retorna true si aTrack se encuentra en la playlist
    */

  }

  save(filename = 'unqfy.json') {
    new picklejs.FileSerializer().serialize(filename, this);
  }

  static load(filename = 'unqfy.json') {
    const fs = new picklejs.FileSerializer();
    // TODO: Agregar a la lista todas las clases que necesitan ser instanciadas
    const classes = [UNQfy, Album, Artist, Playlist, Track];
    fs.registerClasses(...classes);
    return fs.load(filename);
  }
}

class Album {
  constructor(artist, name, year) {
    this.name = name;
    this.year = year;
    this.tracks = [];
    this.artist = artist;
  }
}


class Artist {
  constructor(name, country) {
    this.name = name;
    this.country = country;
  }

}

class Playlist {
  constructor(name, genres, maxDuration) {
    this.name = name;
    this.tracks = [];
    this.genres = genres;
    this.maxDuration = maxDuration;
  }


}

class Track {
  constructor(name, duration, genre, album) {
    this.name = name;
    this.duration = duration;
    this.genre = genre;
    this.album = album;
  }

}

// TODO: exportar todas las clases que necesiten ser utilizadas desde un modulo cliente
module.exports = {
  UNQfy,
};

