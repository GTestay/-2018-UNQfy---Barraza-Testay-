/* eslint-env node, mocha */

const assert = require('chai').assert;
const libunqfy = require('./unqfy');
const {NotificadorUnqfy} = require('./notificacionUnqfy');


function createAndAddArtist(unqfy, artistName, country) {
  unqfy.addArtist({name: artistName, country});
  const artist = unqfy.getArtistByName(artistName);
  return artist;
}

function createAndAddAlbum(unqfy, artistName, albumName, albumYear) {
  unqfy.addAlbum(artistName, {name: albumName, year: albumYear});
  return unqfy.getAlbumByName(albumName);
}

function createAndAddTrack(unqfy, albumName, trackName, trackDuration, trackGenre) {
  unqfy.addTrack(albumName, {name: trackName, duration: trackDuration, genre: trackGenre});
  return unqfy.getTrackByName(trackName);
}


describe('Add, remove and filter data', () => {
  let unqfy = null;

  beforeEach(() => {
    unqfy = new libunqfy.UNQfy();
  });

  it('should add an artist', () => {
    const artist = createAndAddArtist(unqfy, 'Guns n\' Roses', 'USA');

    assert.equal(artist.name, 'Guns n\' Roses');
    assert.equal(artist.country, 'USA');
  });

  it('should add an album to an artist', () => {
    createAndAddArtist(unqfy, 'Guns n\' Roses', 'USA');
    const album = createAndAddAlbum(unqfy, 'Guns n\' Roses', 'Appetite for Destruction', 1987);

    assert.equal(album.name, 'Appetite for Destruction');
    assert.equal(album.year, 1987);
  });

  it('should add a track to an album', () => {
    createAndAddArtist(unqfy, 'Guns n\' Roses', 'USA');
    createAndAddAlbum(unqfy, 'Guns n\' Roses', 'Appetite for Destruction', 1987);
    const track = createAndAddTrack(unqfy, 'Appetite for Destruction', 'Welcome to the jungle', 200, 'hard rock');

    assert.equal(track.name, 'Welcome to the jungle');
    assert.strictEqual(track.duration, 200);
    assert.equal(track.genre, 'hard rock');

  });

  it('should get all tracks matching genres', () => {

    createAndAddArtist(unqfy, 'Guns n\' Roses', 'USA');
    createAndAddAlbum(unqfy, 'Guns n\' Roses', 'Appetite for Destruction', 1987);

    const welcomeToTheJungle = createAndAddTrack(unqfy, 'Appetite for Destruction', 'Welcome to the jungle', 200, 'rock');
    const sweetChildOMine = createAndAddTrack(unqfy, 'Appetite for Destruction', 'Sweet Child o\' Mine', 500, 'hard rock');

    createAndAddArtist(unqfy, 'Michael Jackson', 'USA');
    createAndAddAlbum(unqfy, 'Michael Jackson', 'Thriller', 1987);

    const thriller = createAndAddTrack(unqfy, 'Thriller', 'Thriller', 200, 'movie');
    const anotherSong = createAndAddTrack(unqfy, 'Thriller', 'Another song', 500, 'pop');
    const anotherSong2 = createAndAddTrack(unqfy, 'Thriller', 'Another song II', 500, 'pop');

    const tracksMatching = unqfy.getTracksMatchingGenres(['pop', 'movie']);

    // assert.equal(tracks.matching.constructor.name, Array);
    assert.isArray(tracksMatching);
    assert.lengthOf(tracksMatching, 3);
    assert.equal(tracksMatching.includes(welcomeToTheJungle), false);
    assert.equal(tracksMatching.includes(sweetChildOMine), false);

    assert.equal(tracksMatching.includes(thriller), true);
    assert.equal(tracksMatching.includes(anotherSong), true);
    assert.equal(tracksMatching.includes(anotherSong2), true);
  });

  it('should get all tracks matching artist', () => {
    const artist = createAndAddArtist(unqfy, 'Guns n\' Roses', 'USA');
    createAndAddAlbum(unqfy, 'Guns n\' Roses', 'Appetite for Destruction', 1987);
    const t1 = createAndAddTrack(unqfy, 'Appetite for Destruction', 'Welcome to the jungle', 200, ['rock', 'hard rock']);
    const t2 = createAndAddTrack(unqfy, 'Appetite for Destruction', 'It\'s so easy', 200, ['rock', 'hard rock']);
    createAndAddAlbum(unqfy, 'Guns n\' Roses', 'Use Your Illusion I', 1992);
    const t3 = createAndAddTrack(unqfy, 'Use Your Illusion I', 'Don\'t Cry', 500, ['rock', 'hard rock']);

    createAndAddArtist(unqfy, 'Michael Jackson', 'USA');
    createAndAddAlbum(unqfy, 'Michael Jackson', 'Thriller', 1987);
    createAndAddTrack(unqfy, 'Thriller', 'Thriller', 200, ['pop', 'movie']);
    createAndAddTrack(unqfy, 'Thriller', 'Another song', 500, ['classic']);
    createAndAddTrack(unqfy, 'Thriller', 'Another song II', 500, ['movie']);

    const matchingTracks = unqfy.getTracksMatchingArtist(artist.name);

    assert.isArray(matchingTracks);
    assert.lengthOf(matchingTracks, 3);
    assert.isTrue(matchingTracks.includes(t1));
    assert.isTrue(matchingTracks.includes(t2));
    assert.isTrue(matchingTracks.includes(t3));
  });

  it.skip('loaded instance should  have the same data as the original one', () => {
    createAndAddArtist(unqfy, 'Guns n\' Roses', 'USA');
    createAndAddAlbum(unqfy, 'Guns n\' Roses', 'Appetite for Destruction', 1987);
    createAndAddTrack(unqfy, 'Appetite for Destruction', 'Welcome to the jungle', 200, ['rock', 'hard rock']);
    unqfy.addPlaylist('my playlist', ['pop', 'rock'], 1400);

    unqfy.save('test.json');
    const loadedUnqfy = libunqfy.UNQfy.load('test.json');

    const artist = loadedUnqfy.getArtistByName('Guns n\' Roses');
    const album = loadedUnqfy.getAlbumByName('Appetite for Destruction');
    const track = loadedUnqfy.getTrackByName('Welcome to the jungle');

    assert.equal(artist.name, 'Guns n\' Roses');
    assert.equal(artist.country, 'USA');

    assert.equal(album.name, 'Appetite for Destruction');
    assert.equal(album.year, 1987);

    assert.equal(track.name, 'Welcome to the jungle');
    assert.equal(track.duration, 200);
    assert.equal(track.genres.includes('rock'), true);
    assert.equal(track.genres.includes('hard rock'), true);
    assert.equal(track.genres.length, 2);
    assert.equal(loadedUnqfy.getPlaylistByName('my playlist').name, 'my playlist');
  });




  it('remove the artist should remove the tracks and the album', () => {

    createAndAddArtist(unqfy, 'Guns n\' Roses', 'USA');
    createAndAddAlbum(unqfy, 'Guns n\' Roses', 'Appetite for Destruction', 1987);
    createAndAddTrack(unqfy,'Appetite for Destruction','Welcome to the jungle','10:20','Rock');
    assert.isTrue(unqfy.artists.length !== 0);
    assert.isTrue(unqfy.allAlbums().length !== 0);
    assert.isTrue(unqfy.allTracks().length !== 0);

    unqfy.removeArtist('Guns n\' Roses');

    assert.isTrue(unqfy.artists.length === 0);
    assert.isTrue(unqfy.allAlbums().length === 0);
    assert.isTrue(unqfy.allTracks().length === 0);


  });

  it('remove the album should remove the tracks and the album but not the artist', () => {

    createAndAddArtist(unqfy, 'Guns n\' Roses', 'USA');
    createAndAddAlbum(unqfy, 'Guns n\' Roses', 'Appetite for Destruction', 1987);
    createAndAddTrack(unqfy,'Appetite for Destruction','Welcome to the jungle','10:20','Rock');
    assert.equal(unqfy.artists.length, 1);
    assert.equal(unqfy.allAlbums().length, 1);
    assert.equal(unqfy.allTracks().length, 1);

    unqfy.removeAlbum('Appetite for Destruction');

    assert.equal(unqfy.artists.length, 1);
    assert.equal(unqfy.allAlbums().length, 0);
    assert.equal(unqfy.allTracks().length, 0);


  });


  it('search of the album', () => {

    createAndAddArtist(unqfy, 'Guns n\' Roses', 'USA');
    createAndAddAlbum(unqfy, 'Guns n\' Roses', 'Appetite for Destruction', 1987);
    createAndAddTrack(unqfy,'Appetite for Destruction','Jose perez','10:20','Rock');

    assert.equal(unqfy.artists.length, 1);
    assert.equal(unqfy.allAlbums().length, 1);
    assert.equal(unqfy.allTracks().length, 1);


    const album = unqfy.getAlbumByName('Appetite for Destruction');
    const albums = unqfy.searchAlbumByName('Appetite for Destruction');

    assert.equal(album.name,'Appetite for Destruction');
    assert.isTrue(album.tracks.length === 1);
    assert.isTrue(albums.includes(album));
  });

});

describe('Playlist Creation and properties', () => {
  let unqfy = null;

  beforeEach(() => {
    unqfy = new libunqfy.UNQfy();

  });


  it('should create a playlist as requested', () => {
    createAndAddArtist(unqfy, 'Guns n\' Roses', 'USA');
    createAndAddAlbum(unqfy, 'Guns n\' Roses', 'Appetite for Destruction', 1987);
    const t1 = createAndAddTrack(unqfy, 'Appetite for Destruction', 'Welcome to the jungle', 200, 'rock');
    createAndAddTrack(unqfy, 'Appetite for Destruction', 'Sweet Child o\' Mine', 1500, 'hard rock');

    createAndAddArtist(unqfy, 'Michael Jackson', 'USA');
    createAndAddAlbum(unqfy, 'Michael Jackson', 'Thriller', 1987);
    createAndAddTrack(unqfy, 'Thriller', 'Thriller', 200, 'movie');
    const t2 = createAndAddTrack(unqfy, 'Thriller', 'Another song', 500, 'pop');
    const t3 = createAndAddTrack(unqfy, 'Thriller', 'Another song II', 500, 'pop');

    unqfy.addPlaylist('my playlist', ['pop', 'rock'], 1400);
    const playlist = unqfy.getPlaylistByName('my playlist');

    assert.equal(playlist.name, 'my playlist');
    assert.isAtMost(playlist.duration(), 1400);
    assert.isTrue(playlist.hasTrack(t1));
    assert.isTrue(playlist.hasTrack(t2));
    assert.isTrue(playlist.hasTrack(t3));
  });


});
