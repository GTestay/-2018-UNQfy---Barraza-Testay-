const {ArtistNotFoundException, AlbumNotFoundException, TrackNotFoundException} = require('./Excepciones');
const picklejs = require('picklejs');
const fs = require('fs');
const spotifyModule = require('./Spotify');


const {aplanar} = require('./funcionesAuxiliares');


class UNQfy {

  constructor() {
    this.idAlbum = 0;
    this.idArtist = 0;
    this.artists = [];
    this.playlists = [];
  }

  //Dado un nombre de artista, busca sus albumnes en spotify
  // y los guarda en él.
  populateAlbumsForArtist(artistName) {
    let artist;
    try {
      artist = this.getArtistByName(artistName);

    } catch (ArtistNotFoundException) {
      console.log('EL ARTISTA NO EXISTE');
    }
    const spotify = new spotifyModule.Spotify();

    spotify.getArtistFromAPI(artist)
      .then(artist => {
        return spotify.getAlbumsFromArtist(artist.id);
      })
      .then(albums => {

          this.addAlbumsToArtist(albums, artist);
        }
      )
      .catch(err => {
        console.log(err);
      });


  }

  addAlbumsToArtist(albums, artist) {
    albums.forEach(album => artist.addAlbum(album));
  }

  // ADD METHODS

  /* Debe soportar al menos:
         params.name (string)
         params.country (string)
      */
  addArtist(params) {
    // El objeto artista creado debe soportar (al menos) las propiedades name (string) y country (string)
    const newArtist = new Artist(params.name, params.country, this.idForArtist());
    this.artists.push(newArtist);

  }
  
  /* Debe soportar al menos:
          params.name (string)
          params.year (number)
      */
  addAlbum(artistName, params) {
    // El objeto album creado debe tener (al menos) las propiedades name (string) y year
    const artist = this.getArtistByName(artistName);
    this.addAlbumToArtist(artist, params);
  
  }

  addAlbumToArtist(artist, params) {
    const newAlbum = new Album(artist, params.name, params.year, this.idForAlbum());
    artist.addAlbum(newAlbum);
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

  // REMOVE METHODS
  removeArtist(aName) {
    const artistToRemove = this.getArtistByName(aName);
    const tracksToDelete = artistToRemove.albums.map(album => album.tracks);

    this.playlists.forEach(playlist => playlist.removeTracks(tracksToDelete));

    this.artists = this.artists.splice(this.artists.indexOf(artistToRemove), 1);
  }

  removePlaylist(aName) {
    this.playlists = this.playlists.filter(playlist => playlist.name !== aName);
  }

  removeAlbum(aName) {
    const allTracksFromAlbum = aplanar(this.artists.map(a => a.tracksFromAlbum(aName)));

    this.artists = this.artists.forEach(a => a.removeAlbum(aName));

    this.removeTracksFromPlaylist(allTracksFromAlbum);

  }

  removeTrack(aName) {
    this.removeTrackFromAlbum(aName);
    this.removeTrackFromPlaylist(aName);
  }

  removeTrackFromPlaylist(aName) {
    this.playlists.forEach(playlist => playlist.removeTrack(aName));
  }

  removeTracksFromPlaylist(allTracksFromAlbum) {
    this.playlists.forEach(p => p.removeTracks(allTracksFromAlbum));
  }

  removeTrackFromAlbum(aName) {
    this.allAlbums().forEach(album => album.removeTrack(aName));
  }


  listTracks() {
    return aplanar(this.allAlbums().map(album => album.tracks));
  }

  //SEARCH METHODS
  searchArtistByName(name) {
    return this.artists.filter(artist => artist.name.includes(name));
  }
  
  
  searchAlbumByName(name) {
    return this.allAlbums().filter(album => album.name.includes(name));
  }
  
  searchPlaylistByName(name) {
    return this.playlists.filter(playlist => playlist.name.includes(name));
  }
  
  searchTrackByName(name) {
    const tracks = this.listTracks();
    
    return tracks.filter(track => track.name.includes(name));
  }
  
  //GET 'SOMETHING' METHODS
  
  getTracksMatchingGenres(genres) {
    // Debe retornar todos los tracks que contengan alguno de los generos en el parametro genres
  
    const tracksFiltered = this.artists.map(artist => artist.tracksWithGenres(genres));

    return aplanar(tracksFiltered);

  }
  
  getTracksMatchingArtist(artistName) {

    const albums = this.allAlbums();
    const albumnsWithFilteredTracks = albums.filter(album => artistName.includes(album.artistName)).map(album => album.tracks);

    return aplanar(albumnsWithFilteredTracks);
  }
  
  getArtistBy(filter, valueError) {
    const artistSearched = this.artists.find(filter);
    if (artistSearched !== undefined)
      return artistSearched;
    else
      throw new ArtistNotFoundException(valueError);
  }
  
  getArtistByName(name) { return this.getArtistBy(a => a.name == name, name); }  
  getArtistById(id) { return this.getArtistBy(a => a.id == id, id); } 
  
  /*getArtistById(id) {
    const artistSearched = this.artists.find(a => a.id == id);
    if (artistSearched !== undefined)
      return artistSearched;
    else
      throw new ArtistNotFoundException(id);
  }*/
  
  getAlbumByName(name) {
    const albums = this.allAlbums();

    return albums.find(album => album.name === name);
  }

  getTrackByName(name) {
    const album = this.findAlbumWithTrackName(name);
    if (album !== undefined) {
      return album.getTrack(name);
    }
    return undefined;
  }

  getPlaylistByName(name) {
    return this.playlists.find(playlist => playlist.name === name);
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

  findAlbumWithTrackName(name) {
    const albums = this.allAlbums();
    return albums.find(album => album.hasThisTrack(name));
  }

  allAlbums() {
    return aplanar(this.artists.map(a => a.albums));
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

  idForAlbum() {
    let id = this.idAlbum;
    this.idAlbum++;
    return id;
  }

  idForArtist() {
    let id = this.idArtist;
    this.idArtist++;
    return id;
  }
}

class TrackList {
  constructor(name) {
    this.name = name;
    this.tracks = [];

  }

  genres() {
    return this.tracks.map(track => track.genre).reduce((genre1, genre2) => genre1 === genre2, []);
  }

  removeTrack(aName) {
    this.tracks = this.tracks.filter(track => track.name !== aName);
  }

  removeTracks(listOfTracks) {
    this.tracks = this.tracks.filter(track => listOfTracks.includes(track));
  }

  addTrack(aTrack) {
    this.tracks.push(aTrack);
  }

  getTrack(name) {
    return this.tracks.find(track => track.name.includes(name));
  }

  duration() {
    return this.tracks.map(track => track.duration)
      .reduce((duration1, duration2) => duration1 + duration2, 0);
  }

}

class Album extends TrackList {
  constructor(artist, name, year,id) {
    super(name);
    this.year = year;
    this.artistName = artist.name;
    this.id = id;
  }

  hasThisTrack(name) {
    return this.tracks.some(track => track.name === (name));
  }

  tracksWithGenres(genres) {
    return this.tracks.filter(track => track.withThisGenres(genres));
  }


  toString() {
    return ` name: ${this.name}, year: ${this.year}, artist: ${this.artistName} `;
  }
}


class Artist {
  constructor(name, country,id) {
    this.name = name;
    this.albums = [];
    this.country = country;
    this.id = id;

  }
  
  addAlbum(anAlbum) {
    this.albums.push(anAlbum);
  }
  
  tracksFromAlbum(aName) {
    const albumSearched = this.albums.find(a => a.name === aName);
    return albumSearched.tracks;
  }
  
  tracksWithGenres(genres) {
    return aplanar(this.albums.map(album => album.tracksWithGenres(genres)));
  }
  
  toString() {
    return `name: ${this.name}, country: ${this.country}, id: ${this.id}`;
  }
  
  toJson() {
    return `{id: ${this.id}, name: ${this.name}, country: ${this.country} `;
  }
}

class Playlist extends TrackList {

  constructor(name, genres, maxDuration) {
    super(name);
    this.genres = genres;
    this.maxDuration = maxDuration;
  }

  genres() {
    return this.genres;
  }

  hasTrack(aTrack) {
    return this.tracks.includes(aTrack);
  }

  toString() {
    return `name: ${this.name} size of tracks: ${this.tracks.length} max duration: ${this.maxDuration}`;
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
    return this.genre.includes(genre);
  }

  toString() {
    return ` name: ${this.name}, album: ${this.album.name}, genre: ${this.genre}, duration: ${this.duration} `;
  }

}

// TODO: exportar todas las clases que necesiten ser utilizadas desde un modulo cliente
module.exports = {
  UNQfy,
};

