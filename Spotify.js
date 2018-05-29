const req = require('request-promise');
const fs = require('fs');

class Spotify {

  constructor() {

  }

  token(){
    return'BQCBr4A5mBEaSWfMBW4i7qCmQu61mKfzFPLsitLKtB8T6BzL3uAQ_mVWzWD4JGo1RcKvggl6DoarzivHUDgh5TKSLNR-DTzIYLBUVGVZKeYkLch17Hq49xX2B4TGi_YufCrtklSlkpiXcyod2jVRD1FtzyBf5jt2Tw';
  }
  api() {
    return 'https://api.spotify.com/v1';
  }

  //Devuelve una promesa con la id
  getArtistID(artist) {
    const url = `${this.api()}/search?q=${artist.name}&type=artist`;

    console.log(url);
    const options = {
      uri: url,
      headers: {Authorization: 'Bearer ' + this.token()},
      json: true
    };

    let artistListJson;
    const promise= req.get(options)
      .then((response) => {

        if(response.error){
          console.log(response.error);
        }
        artistListJson = response.artists.items;

        return artistListJson.find(a => a.name === artist.name);
      })
      .catch(error => console.log(error));

    return promise;

  }

  getAlbumsFromArtist(id) {
    const url = `${this.api()}/artists/${id}/albums`;

    console.log(url);
    const options = {
      uri: url,
      headers: {Authorization: 'Bearer ' + this.token()},
      json: true
    };

    const albumRetrieve = req.get(options).then(response=>{
      const albums = [];

      response.items.forEach(a => {
        albums.push( {
          name: a.name,
          id: a.id,
          images: a.images,
          year: a.release_date
        });
      });
      return albums;

    }
    );

    return albumRetrieve;
  }
}


module.exports = {Spotify};