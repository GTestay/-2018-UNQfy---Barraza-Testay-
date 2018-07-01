/* eslint-env node, mocha */
const promise = require('chai-as-promised');
const assert = require('chai').assert;
const libunqfy = require('./unqfy');

const {ApiNotificationStateless,NotificadorUnqfy} = require('./notificacionUnqfy');


function createAndAddArtist(unqfy, artistName, country) {
  unqfy.addArtist({name: artistName, country});
  const artist = unqfy.getArtistByName(artistName);
  return artist;
}


function createAndAddAlbum(unqfy, artistName, albumName, albumYear) {
  unqfy.addAlbum(artistName, {name: albumName, year: albumYear});
  return unqfy.getAlbumByName(albumName);
}


describe('MOCK Notification Service', () => {
  let unqfy = null;
  let notificador = null;
  let mock;

  beforeEach(() => {
    unqfy = new libunqfy.UNQfy();
    mock = new ApiNotificationStateless();
    notificador = new NotificadorUnqfy(mock);
    unqfy.addNotificationService(notificador);
  });

  it('The notificator must not be notified but it must be added to the artist', () => {

    const artist = createAndAddArtist(unqfy, 'Guns n\' Roses', 'USA');

    assert.equal(mock.notificacionesEnviadas,0);
    assert.lengthOf(artist.observers,1);
  });


  it('The notificator must be notified when an album is added ', () => {

    createAndAddArtist(unqfy, 'Guns n\' Roses', 'USA');
    createAndAddAlbum(unqfy, 'Guns n\' Roses', 'Appetite for Destruction', 1987);


    assert.equal(mock.notificacionesEnviadas,1);
  });

  it('The notificator with one artist when it s remove',()=>{

    const artists = createAndAddArtist(unqfy, 'Guns n\' Roses', 'USA');
    createAndAddAlbum(unqfy, 'Guns n\' Roses', 'Appetite for Destruction', 1987);
    unqfy.removeArtist(artists.name);

    assert.equal(mock.notificacionesEnviadas,2);

  });


});
