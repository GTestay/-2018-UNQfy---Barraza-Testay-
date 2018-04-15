const picklejs = require('picklejs');

function aplanar(array) {

  return array.reduce((arg1, arg2) => arg1.concat(arg2));
}

class UNQfy {
  constructor() {
    this.artist = [];
    this.albums = [];
    this.playlists = [];
  }

  getTracksMatchingGenres(genres) {
    // Debe retornar todos los tracks que contengan alguno de los generos en el parametro genres
    const albumnsWithFilteredTracks = this.albums.map(albums => albums.tracksWithGenres(genres));

    return aplanar(albumnsWithFilteredTracks);

  }


  getTracksMatchingArtist(artistName) {
    const albumnsWithFilteredTracks = this.albums.filter(album => album.artist === artistName).map(album => album.tracks);

    return aplanar(albumnsWithFilteredTracks);
  }


  /* Debe soportar al menos:
         params.name (string)
         params.country (string)
      */
  addArtist(params) {
    // El objeto artista creado debe soportar (al menos) las propiedades name (string) y country (string)
    const newArtist = new Artist(params.name, params.country);
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
    const album = this.albums.find(album => album.hasThisTrack(name));
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
    let newPlaylist = new Playlist(name, genresToInclude, maxDuration);
    newPlaylist = this.putRandomTracksInPlaylist(newPlaylist);
    this.playlists.push(newPlaylist);
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

  putRandomTracksInPlaylist(aPlaylist) {

    let tracksWithTheSpecifiedGenres = this.getTracksMatchingGenres(aPlaylist.genres);


    tracksWithTheSpecifiedGenres.forEach((actualTrack) => {
      if ((aPlaylist.duration() + actualTrack.duration) <= aPlaylist.maxDuration) {
        console.log(actualTrack.name, actualTrack.duration);

        aPlaylist.addTrack(actualTrack);
      }
    });


    return aPlaylist;
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

  getTrack(name) {
    return this.tracks.find(track => track.name === name);
  }

  hasThisTrack(name) {
    return this.tracks.some(track => track.name === name);
  }

  tracksWithGenres(genres) {
    return this.tracks.filter(track => track.includesGenres(genres));
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

  duration() {
    return this.tracks.map(track => track.duration)
      .reduce((duration1, duration2) => duration1 + duration2, 0);
  }

  hasTrack(aTrack) {
    return this.tracks.includes(aTrack);
  }

  addTrack(aTrack) {
    this.tracks.push(aTrack);
  }
}

class Track {
  constructor(name, duration, genres, album) {
    this.name = name;
    this.duration = duration;
    this.genres = genres || [];
    this.album = album;
  }

  includesGenres(genres) {
    return this.genres.some(genre => genres.includes(genre));
  }

}

// TODO: exportar todas las clases que necesiten ser utilizadas desde un modulo cliente
module.exports = {
  UNQfy,
};

