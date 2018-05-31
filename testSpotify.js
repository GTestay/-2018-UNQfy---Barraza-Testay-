/* eslint-env node, mocha */
'use strict';


const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.should();
chai.use(chaiAsPromised);


const assert = chai.assert;
const expect = chai.expect;

const moduleUnqfy = require('./unqfy');
const moduleSpotify = require('./Spotify');


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


    let promise = spotify.getAlbumsFromArtist('1QOmebWGB6FdFtW7Bo3F0W');

    return expect(promise.then(albums => albums.length)).to.eventually.equal(20);

  });


});