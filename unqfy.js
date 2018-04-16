const picklejs = require('picklejs');

function aplanar(array) {
  return array.reduce((arg1, arg2) => arg1.concat(arg2));
}

class UNQfy {
  constructor() {
    this.artists = [];
    this.albums = [];
    this.playlists = [];
  }

  getTracksMatchingGenres(genres) {
    // Debe retornar todos los tracks que contengan alguno de los generos en el parametro genres
    const tracksFiltered = this.albums.map(albums => albums.tracksWithGenres(genres));

    return aplanar(tracksFiltered);

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
    this.artists.push(newArtist);

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
                 genre (string)
            */
    const albumSearched = this.getAlbumByName(albumName);
    const newTrack = new Track(params.name, params.duration, params.genre, albumSearched);
    albumSearched.addTrack(newTrack);
  }

  removeTrack(aName) {
    this.removeTrackFromAlbum(aName);
    this.removeTrackFromPlaylist(aName);
  }

  removeArtist(aName) {
    this.artists = this.artists.filter(artist => artist.name !== aName);
  }

  removePlaylist(aName) {
    this.playlists = this.playlists.filter(playlist => playlist.name !== aName);
  }

  removeAlbum(aName) {
    this.albums = this.albums.filter(album => album.name !== aName);

  }

  getArtistByName(name) {
    return this.artists.find(artist => artist.name === name);
  }

  getAlbumByName(name) {
    return this.albums.find(album => album.name === name);
  }

  getTrackByName(name) {
    const album = this.albums.find(album => album.hasThisTrack(name));
    if (album !== undefined) {
      return album.getTrack(name);
    }
    return undefined;
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


  putRandomTracksInPlaylist(aPlaylist) {

    const tracksWithTheSpecifiedGenres = this.getTracksMatchingGenres(aPlaylist.genres);


    tracksWithTheSpecifiedGenres.forEach((actualTrack) => {
      if ((aPlaylist.duration() + actualTrack.duration) <= aPlaylist.maxDuration) {

        aPlaylist.addTrack(actualTrack);
      }
    });


    return aPlaylist;
  }

  //Persistence
  save(filename = 'estado.json') {
    new picklejs.FileSerializer().serialize(filename, this);
  }

  static load(filename = 'estado.json') {
    const fs = new picklejs.FileSerializer();
    // TODO: Agregar a la lista todas las clases que necesitan ser instanciadas
    const classes = [UNQfy, Album, Artist, Playlist, Track, TrackList];
    fs.registerClasses(...classes);
    return fs.load(filename);
  }

  removeTrackFromPlaylist(aName) {
    this.playlists.forEach(playlist => playlist.removeTrack(aName));
  }

  removeTrackFromAlbum(aName) {
    this.albums.forEach(album => album.removeTrack(aName));
  }
}

class TrackList {
  constructor(name) {
    this.name = name;
    this.tracks = [];

  }

  removeTrack(aName) {
    this.tracks = this.tracks.filter(track => track.name !== aName);
  }

  addTrack(aTrack) {
    this.tracks.push(aTrack);
  }

  getTrack(name) {
    return this.tracks.find(track => track.name === name);
  }

  duration() {
    return this.tracks.map(track => track.duration)
      .reduce((duration1, duration2) => duration1 + duration2, 0);
  }

}

class Album extends TrackList {
  constructor(artist, name, year) {
    super(name);
    this.year = year;
    this.artist = artist;
  }

  addTrack(track) {
    this.tracks.push(track);
  }

  hasThisTrack(name) {
    return this.tracks.some(track => track.name === name);
  }

  tracksWithGenres(genres) {
    return this.tracks.filter(track => track.withThisGenres(genres));
  }


  toString() {
    return ` name: ${this.name}, year: ${this.year}, artist: ${this.artist.name} `;
  }
}


class Artist {
  constructor(name, country) {
    this.name = name;
    this.country = country;
  }

  toString() {
    return ` name: ${this.name}, country: ${this.country} `;
  }
}

class Playlist extends TrackList {

  constructor(name, genres, maxDuration) {
    super(name);
    this.genres = genres;
    this.maxDuration = maxDuration;
  }

  hasTrack(aTrack) {
    return this.tracks.includes(aTrack);
  }


}

class Track {
  constructor(name, duration, genre, album) {
    this.name = name;
    this.duration = duration;
    this.genre = genre;
    this.album = album;
  }

  withThisGenres(genres) {
    return genres.includes(this.genre);
  }

  isThisGenre(genre) {
    return this.genre === genre;
  }

  toString() {
    return ` name: ${this.name}, album: ${this.album.name}, genre: ${this.genre}, duration: ${this.duration} `;
  }

}

// TODO: exportar todas las clases que necesiten ser utilizadas desde un modulo cliente
module.exports = {
  UNQfy,
};

