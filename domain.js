const {aplanar, compareStrings} = require('./funcionesAuxiliares');

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

  hasThisName(aName) {
    return compareStrings(this.name, aName);
  }

}

class Album extends TrackList {
  constructor(artistName, name, year, id) {
    super(name);
    this.year = year;
    this.artistName = artistName;
    this.id = id;
  }

  hasThisTrack(name) {
    return this.tracks.some(track => track.name === (name));
  }

  tracksWithGenres(genres) {
    return this.tracks.filter(track => track.withThisGenres(genres));
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      year: this.year,
      tracks: this.tracks
    };
  }

  toString() {
    return ` name: ${this.name}, year: ${this.year}, artist: ${this.artistName} `;
  }
}


class Artist {
  constructor(name, country, id) {
    this.name = name;
    this.albums = [];
    this.country = country;
    this.id = id;
  }

  addAlbum(anAlbum) {
    this.albums.push(anAlbum);
  }

  removeAlbum(aName) {
    this.albums = this.albums.filter(album => !album.hasThisName(aName));
  }

  tracksFromAlbum(aName) {
    const albumSearched = this.albums.find(a => a.name === aName);
    return albumSearched.tracks;
  }


  tracksWithGenres(genres) {
    return aplanar(this.albums.map(album => album.tracksWithGenres(genres)));
  }

  hasThisName(aName) {
    return compareStrings(this.name, aName);
  }

  hasThisAlbum(aName) {
    return this.albums.find(a => a.hasThisName(aName)) !== undefined;
  }

  toString() {
    return `name: ${this.name}, country: ${this.country}, id: ${this.id}`;
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
  constructor(name, duration, genre, albumName) {
    this.name = name;
    this.duration = duration;
    this.genre = genre;
    this.albumName = albumName;
    this.lyrics = undefined;
  }

  hasLyrics() {
    return this.lyrics !== undefined;
  }

  withThisGenres(genres) {
    return genres.includes(this.genre);
  }

  isThisGenre(genre) {
    return this.genre.includes(genre);
  }

  toString() {
    return ` name: ${this.name}, album: ${this.albumName}, genre: ${this.genre}, duration: ${this.duration} `;
  }

}

module.exports = {
  Album,
  Artist,
  Playlist,
  TrackList,
  Track
};