/* eslint-env node, mocha */
'use strict';
const Track = require('./domain').Track;

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.should();
chai.use(chaiAsPromised);


const assert = chai.assert;
const expect = chai.expect;

const moduleUnqfy = require('./unqfy');
const moduleSpotify = require('./Spotify');
const moduleMusixMatch = require('./MusixMatch');

describe('Spotify API use', () => {

  let unqfy = null;
  let spotify = null;

  beforeEach(() => {
    unqfy = new moduleUnqfy.UNQfy();
    spotify = new moduleSpotify.Spotify();
  });


  it('Deberia de retornar el id de el artista buscado en spotify', () => {

    const json = {
      name: 'Gustavo Cerati',
      country: 'ARG'
    };

    const promiseArtist = spotify.getArtistFromAPI(json).then(responseArtist => {

      console.log('Mismo nombre? ', json.name === responseArtist.name);
      console.log('ID', responseArtist.id);
      console.log(responseArtist.name);
      return responseArtist;
    });

    return expect(promiseArtist.then(artist => artist.name)).to.eventually.equal(json.name);
  });

  it('Dado un id de artista deberia retornarte sus albumnes', () => {


    const promise = spotify.getAlbumsFromArtist('1QOmebWGB6FdFtW7Bo3F0W');
    promise.then(a=>console.log(a));
    return expect(promise.then(albums => albums.length)).to.eventually.equal(20);

  });


});


describe('MusixMatch API use', () => {
  let unqfy = null;
  let musix = null;
  let cancion = null;

  beforeEach(() => {
    unqfy = new moduleUnqfy.UNQfy();
    musix = new moduleMusixMatch.MusixMatch();
    cancion = new Track('Ghost of Karelia', '5:24', 'Metal', 'Crack the Skye');

  });


  it('dada una cancion te tiene que dar la id de musixmatch ', () => {

    const promise = musix.searchTrack(cancion);

    return promise.should.be.fulfilled;

  });
  it('dado un id de una cancion te retorna su letra', () => {

    const promise = musix.searchTrack(cancion)
      .then(track => musix.searchLyric(track));

    return promise.should.be.fulfilled;
  });

  it('dada una cancion me retorna su letra ', () => {

    const promise = unqfy.getLyricsFor(cancion);

    return expect(promise.then(t => t.hasLyrics())).to.eventually.equal(true);


  });


});