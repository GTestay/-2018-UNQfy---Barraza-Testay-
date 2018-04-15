const picklejs = require('picklejs');

class UNQfy {
  constructor() {
    this.artist = [];
    this.albums = [];
    this.playlists = [];
  }

  getTracksMatchingGenres(genres) {
    // Debe retornar todos los tracks que contengan alguno de los generos en el parametro genres
    return this.albums
      .map(albums => albums.tracksWithGenres(genres))
      .filter((track,otherTrack) => track === otherTrack);

  }


  getTracksMatchingArtist(artistName) {

  }


  /* Debe soportar al menos:
         params.name (string)
         params.country (string)
      */
  addArtist(params) {
    // El objeto artista creado debe soportar (al menos) las propiedades name (string) y country (string)
    const newArtist = new Artist(params.name, params.country);
    console.log(newArtist);
    this.artist.push(newArtist);

  }


  /* Debe soportar al menos:
          params.name (string)
          params.year (number)
      */
  addAlbum(artistName, params) {
    // El objeto album creado debe tener (al menos) las propiedades name (string) y year
    const artist = this.getArtistByName(artistName);
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
    const albumSearched = this.getAlbumByName(albumName);
    const newTrack = new Track(params.name, params.duration, params.genres, albumSearched);
    albumSearched.addTrack(newTrack);
  }

  getArtistByName(name) {
    return this.artist.find(artist => artist.name === name);
  }

  getAlbumByName(name) {
    return this.albums.find(album => album.name === name);

  }

  getTrackByName(name) {
    let album = this.albums.find(album => album.hasThisTrack(name));
    return album.getTrack(name);



  }

  getPlaylistByName(name) {
    return this.playlists.find(playlist => playlist.name === name);

  }

  addPlaylist(name, genresToInclude, maxDuration) {
    /* El objeto playlist creado debe soportar (al menos):
              * una propiedad name (string)
              * un metodo duration() que retorne la duración de la playlist.
              * un metodo hasTrack(aTrack) que retorna true si aTrack se encuentra en la playlist
            */

  }

  save(filename = 'estado.json') {
    new picklejs.FileSerializer().serialize(filename, this);
  }

  static load(filename = 'estado.json') {
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

  addTrack(track) {
    this.tracks.push(track);
  }
  getTrack(name){
    return this.tracks.find(track => track.name === name);
  }
  hasThisTrack(name) {
    return this.tracks.some(track => track.name === name);
  }

  tracksWithGenres(genres) {
    return this.tracks.filter(track => track.genres.includes(genres));
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
  constructor(name, duration, genres, album) {
    this.name = name;
    this.duration = duration;
    this.genres = genres;
    this.album = album;
  }

}

// TODO: exportar todas las clases que necesiten ser utilizadas desde un modulo cliente
module.exports = {
  UNQfy,
};

