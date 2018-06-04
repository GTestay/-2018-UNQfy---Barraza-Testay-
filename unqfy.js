const {ArtistNotFoundException, AlbumNotFoundException, TrackNotFoundException} = require('./Excepciones');
const picklejs = require('picklejs');
const fs = require('fs');
const spotifyModule = require('./Spotify');
const {Artist, Album, Track, TrackList, Playlist} = require('./domain');

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

    const promise = spotify.getArtistFromAPI(artist)
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

    return promise;
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
    return newArtist;
  }

  /* Debe soportar al menos:
          params.name (string)
          params.year (number)
      */
  addAlbum(artistName, params) {
    // El objeto album creado debe tener (al menos) las propiedades name (string) y year
    const artist = this.getArtistByName(artistName);
    return this.addAlbumToArtist(artist, params);
  }

  addAlbumToArtist(artist, params) {
    const newAlbum = new Album(artist.name, params.name, params.year, this.idForAlbum());
    artist.addAlbum(newAlbum);
    return newAlbum;
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

    this.artists.splice(this.artists.indexOf(artistToRemove), 1);
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
  
  getAlbumBy(filter, valueError) {
    const album = this.allAlbums().find(filter);
    if(album !== undefined)
      return album;
    else
      throw new AlbumNotFoundException(valueError);
  }

  getAlbumByName(name) { return this.getAlbumBy(a => a.name == name, name); }
  getAlbumById(id) { return this.getAlbumBy(a => a.id == id, id); }

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

  existArtist(artistName){
    try {
      this.getArtistByName(artistName);

    }  catch (ArtistNotFoundException) {
      return false;
    }
    return true;

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
    const id = this.idAlbum;
    this.idAlbum++;
    return id;
  }

  idForArtist() {
    const id = this.idArtist;
    this.idArtist++;
    return id;
  }
}

module.exports = {
  UNQfy,
};

